import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateInvoiceNumberingDto } from "./dto/update-invoice-numbering.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get user profile" })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update user profile" })
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Patch("invoice-numbering")
  @ApiOperation({ summary: "Update invoice numbering settings" })
  updateInvoiceNumbering(
    @Request() req,
    @Body() dto: UpdateInvoiceNumberingDto,
  ) {
    return this.usersService.updateInvoiceNumbering(req.user.id, dto);
  }
}
