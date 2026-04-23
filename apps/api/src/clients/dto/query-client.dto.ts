import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../common/dto/pagination.dto";

export enum ClientSortBy {
  NAME = "name",
  CREATED_AT = "createdAt",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class QueryClientDto extends PaginationDto {
  @ApiPropertyOptional({ description: "Search by name, email or phone" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ClientSortBy, default: ClientSortBy.NAME })
  @IsOptional()
  @IsEnum(ClientSortBy)
  sortBy?: ClientSortBy = ClientSortBy.NAME;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.ASC;
}
