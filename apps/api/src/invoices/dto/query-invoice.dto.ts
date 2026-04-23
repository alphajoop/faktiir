import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export enum InvoiceFilterStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export enum InvoiceSortBy {
  NUMBER = "number",
  ISSUE_DATE = "issueDate",
  DUE_DATE = "dueDate",
  TOTAL = "total",
  STATUS = "status",
  CREATED_AT = "createdAt",
  CLIENT_NAME = "clientName",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class QueryInvoiceDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "Search by invoice number or client name",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: InvoiceFilterStatus })
  @IsOptional()
  @IsEnum(InvoiceFilterStatus)
  status?: InvoiceFilterStatus;

  @ApiPropertyOptional({ description: "Filter by client ID" })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({
    enum: InvoiceSortBy,
    default: InvoiceSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(InvoiceSortBy)
  sortBy?: InvoiceSortBy = InvoiceSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
