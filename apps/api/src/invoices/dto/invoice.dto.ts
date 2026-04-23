import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class InvoiceItemDto {
  @ApiProperty({ example: "Design UI/UX" })
  @IsString()
  description!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export class CreateInvoiceDto {
  @ApiProperty({ example: "60d21b4667d0d8992e610c85" })
  @IsString()
  clientId!: string;

  @ApiProperty({ example: "2026-01-01" })
  @IsDateString()
  issueDate!: string;

  @ApiProperty({ example: "2026-01-15" })
  @IsDateString()
  dueDate!: string;

  @ApiProperty({ example: 20, description: "Tax percentage (e.g. 20 for 20%)" })
  @IsNumber()
  @Min(0)
  tax!: number;

  @ApiPropertyOptional({ example: "Merci pour votre confiance." })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items!: InvoiceItemDto[];
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @ApiPropertyOptional({ enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}
