import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "My Company SARL" })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ example: "https://mysite.com/logo.png" })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
