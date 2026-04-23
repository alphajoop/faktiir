import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Client, Invoice, InvoiceItem, Prisma } from "@prisma/client";
import { PaginatedResponse } from "../common/dto/pagination.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CreateInvoiceDto, UpdateInvoiceDto } from "./dto/invoice.dto";
import { QueryInvoiceDto } from "./dto/query-invoice.dto";

// Type for the where clause in invoice queries
type InvoiceWhereInput = Prisma.InvoiceWhereInput & {
  userId: string;
  OR?: Array<{
    number?: { contains: string; mode: Prisma.QueryMode };
    client?: { name: { contains: string; mode: Prisma.QueryMode } };
    notes?: { contains: string; mode: Prisma.QueryMode };
  }>;
};

// Type for the orderBy clause in invoice queries
type InvoiceOrderByInput =
  | {
      [K in keyof Prisma.InvoiceOrderByWithRelationInput]: Prisma.InvoiceOrderByWithRelationInput[K];
    }
  | { client: { name: "asc" | "desc" } };

// Type for the invoice data returned with relations
type InvoiceWithRelations = Invoice & {
  client: Client;
  items: InvoiceItem[];
};

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère le prochain numéro de facture selon les préférences du user
   * et incrémente atomiquement le compteur en base.
   */
  private async generateInvoiceNumber(userId: string): Promise<string> {
    // Récupérer et incrémenter atomiquement invoiceNextNumber
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { invoiceNextNumber: { increment: 1 } },
      select: {
        invoicePrefix: true,
        invoiceNextNumber: true, // valeur APRÈS incrément
        invoicePadding: true,
      },
    });

    // Le numéro utilisé est invoiceNextNumber - 1 (avant incrément)
    const num = user.invoiceNextNumber - 1;
    const padded = String(num).padStart(user.invoicePadding, "0");
    const prefix = user.invoicePrefix.trim() || "FAK";

    return `${prefix}-${padded}`;
  }

  async findAll(
    userId: string,
    query: QueryInvoiceDto,
  ): Promise<PaginatedResponse<InvoiceWithRelations>> {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      clientId,
      sortBy = "createdAt",
      order = "desc",
    } = query;

    const skip = (page - 1) * limit;

    // Base where — exclude invoices with null number (legacy data)
    const where: InvoiceWhereInput = {
      userId,
      number: { not: undefined },
    };

    // We also handle at the application level below, but this narrows the query
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy — handle nested client.name sort
    const orderBy: InvoiceOrderByInput =
      sortBy === "clientName"
        ? { client: { name: order as "asc" | "desc" } }
        : { [sortBy]: order as "asc" | "desc" };

    const [rawData, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { client: true, items: true },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    // Safety filter — skip any document that slipped through with a null number
    const data = rawData.filter(
      (inv) => inv.number != null,
    ) as InvoiceWithRelations[];

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { client: true, items: true, user: true },
    });
    if (!invoice) throw new NotFoundException("Invoice not found");
    if (invoice.userId !== userId) throw new ForbiddenException();
    return invoice;
  }

  async create(userId: string, dto: CreateInvoiceDto) {
    const items = dto.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * dto.tax) / 100;
    const total = subtotal + taxAmount;

    const number = await this.generateInvoiceNumber(userId);

    return this.prisma.invoice.create({
      data: {
        number,
        status: "DRAFT",
        issueDate: new Date(dto.issueDate),
        dueDate: new Date(dto.dueDate),
        tax: dto.tax,
        total,
        notes: dto.notes,
        userId,
        clientId: dto.clientId,
        items: { create: items },
      },
      include: { client: true, items: true },
    });
  }

  async update(id: string, userId: string, dto: UpdateInvoiceDto) {
    await this.findOne(id, userId);

    const updateData: { [key: string]: unknown } = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.issueDate) updateData.issueDate = new Date(dto.issueDate);
    if (dto.dueDate) updateData.dueDate = new Date(dto.dueDate);

    if (dto.items || dto.tax !== undefined) {
      const current = await this.prisma.invoice.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!current) throw new Error("Invoice not found");

      if (dto.items) {
        // Recalculate totals when items change
        const newItems = dto.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        }));
        const subtotal = newItems.reduce((s, i) => s + i.total, 0);
        const tax = dto.tax !== undefined ? dto.tax : current.tax;
        const taxAmount = (subtotal * tax) / 100;

        updateData.total = subtotal + taxAmount;
        updateData.tax = tax;

        await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
        updateData.items = { create: newItems };
      } else if (dto.tax !== undefined) {
        // Only tax changed — recalculate total
        const subtotal = current.items.reduce((s, i) => s + i.total, 0);
        const taxAmount = (subtotal * dto.tax) / 100;
        updateData.total = subtotal + taxAmount;
        updateData.tax = dto.tax;
      }
    }

    return this.prisma.invoice.update({
      where: { id },
      data: updateData,
      include: { client: true, items: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return this.prisma.invoice.delete({ where: { id } });
  }

  /**
   * Fix utility: assign invoice numbers to any legacy invoices that have null number.
   * Call via a one-time script or admin endpoint.
   */
  async fixNullInvoiceNumbers(): Promise<{ fixed: number }> {
    // Find all invoices and filter for null numbers (MongoDB + Prisma compatibility)
    const allInvoices = await this.prisma.invoice.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, number: true, userId: true, createdAt: true },
    });

    const nullInvoices = allInvoices.filter((inv) => inv.number == null);

    let fixed = 0;
    for (const inv of nullInvoices) {
      const count = await this.prisma.invoice.count({
        where: { userId: inv.userId, number: { not: undefined } },
      });
      const newNumber = `FAK-${String(count + 1 + fixed).padStart(4, "0")}`;
      await this.prisma.invoice.update({
        where: { id: inv.id },
        data: { number: newNumber },
      });
      fixed++;
    }

    return { fixed };
  }
}
