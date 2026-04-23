import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from "class-validator";

export class UpdateInvoiceNumberingDto {
  @ApiPropertyOptional({
    example: "FAK",
    description:
      "Préfixe des numéros de facture (lettres et chiffres uniquement)",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Matches(/^[A-Za-z0-9-]+$/, {
    message: "Le préfixe ne peut contenir que des lettres, chiffres et tirets",
  })
  invoicePrefix?: string;

  @ApiPropertyOptional({
    example: 1,
    description: "Prochain numéro à utiliser (minimum 1)",
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  invoiceNextNumber?: number;

  @ApiPropertyOptional({
    example: 4,
    description: "Nombre de chiffres (padding) — 4 donne 0001",
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  invoicePadding?: number;
}
