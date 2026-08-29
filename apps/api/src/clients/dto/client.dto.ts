import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString } from "class-validator";

function emptyToUndefined({ value }: { value: unknown }) {
  if (value == null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

export class CreateClientDto {
  @ApiProperty({ example: "Acme Corp" })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "contact@acme.com" })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsEmail({}, { message: "E-mail invalide" })
  email?: string;

  @ApiPropertyOptional({ example: "123 Business Street, Paris 75001" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: "+33 1 23 45 67 89" })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
