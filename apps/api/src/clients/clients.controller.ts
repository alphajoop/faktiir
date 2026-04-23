import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ClientsService } from "./clients.service";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { QueryClientDto } from "./dto/query-client.dto";

@ApiTags("Clients")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("clients")
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: "Get all clients (paginated)" })
  findAll(@Request() req, @Query() query: QueryClientDto) {
    return this.clientsService.findAll(req.user.id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a client by ID" })
  @ApiResponse({ status: 404, description: "Client not found" })
  findOne(@Param("id") id: string, @Request() req) {
    return this.clientsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new client" })
  @ApiResponse({ status: 201, description: "Client created" })
  create(@Request() req, @Body() dto: CreateClientDto) {
    return this.clientsService.create(req.user.id, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a client" })
  update(
    @Param("id") id: string,
    @Request() req,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, req.user.id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a client" })
  remove(@Param("id") id: string, @Request() req) {
    return this.clientsService.remove(id, req.user.id);
  }
}
