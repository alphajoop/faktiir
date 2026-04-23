import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
  @ApiProperty({ example: "Acme Corp" })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "contact@acme.com" })
  @IsOptional()
  @IsEmail()
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
