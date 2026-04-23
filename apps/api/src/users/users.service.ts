import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateInvoiceNumberingDto } from "./dto/update-invoice-numbering.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    const { password: _, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    const { password: _, ...result } = user;
    return result;
  }

  async updateInvoiceNumbering(id: string, dto: UpdateInvoiceNumberingDto) {
    const data: Record<string, unknown> = {};

    if (dto.invoicePrefix !== undefined) {
      data.invoicePrefix = dto.invoicePrefix.trim().toUpperCase();
    }
    if (dto.invoiceNextNumber !== undefined) {
      data.invoiceNextNumber = dto.invoiceNextNumber;
    }
    if (dto.invoicePadding !== undefined) {
      data.invoicePadding = dto.invoicePadding;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password: _, ...result } = user;
    return result;
  }
}
