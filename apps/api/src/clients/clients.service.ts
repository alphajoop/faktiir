import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Client, Prisma } from "@prisma/client";
import { PaginatedResponse } from "../common/dto/pagination.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { QueryClientDto } from "./dto/query-client.dto";

// Type for where clause in client queries
type ClientWhereInput = Prisma.ClientWhereInput & {
  userId: string;
  OR?: Array<{
    name?: { contains: string; mode: Prisma.QueryMode };
    email?: { contains: string; mode: Prisma.QueryMode };
    phone?: { contains: string; mode: Prisma.QueryMode };
  }>;
};

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    query: QueryClientDto,
  ): Promise<PaginatedResponse<Client>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = "name",
      order = "asc",
    } = query;

    const skip = (page - 1) * limit;

    // Build search filter
    const where: ClientWhereInput = { userId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        orderBy: { [sortBy]: order as "asc" | "desc" },
        skip,
        take: limit,
      }),
      this.prisma.client.count({ where }),
    ]);

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string, userId: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException("Client not found");
    if (client.userId !== userId) throw new ForbiddenException();
    return client;
  }

  async create(userId: string, dto: CreateClientDto) {
    return this.prisma.client.create({ data: { ...dto, userId } });
  }

  async update(id: string, userId: string, dto: UpdateClientDto) {
    await this.findOne(id, userId);
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.client.delete({ where: { id } });
  }
}
