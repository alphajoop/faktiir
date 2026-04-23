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
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PdfService } from "../pdf/pdf.service";
import { CreateInvoiceDto, UpdateInvoiceDto } from "./dto/invoice.dto";
import { QueryInvoiceDto } from "./dto/query-invoice.dto";
import { InvoicesService } from "./invoices.service";

@ApiTags("Invoices")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("invoices")
export class InvoicesController {
  constructor(
    private invoicesService: InvoicesService,
    private pdfService: PdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all invoices (paginated)" })
  findAll(@Request() req, @Query() query: QueryInvoiceDto) {
    return this.invoicesService.findAll(req.user.id, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an invoice by ID" })
  @ApiResponse({ status: 404, description: "Invoice not found" })
  findOne(@Param("id") id: string, @Request() req) {
    return this.invoicesService.findOne(id, req.user.id);
  }

  @Get(":id/pdf")
  @ApiOperation({ summary: "Download invoice as PDF" })
  @ApiResponse({ status: 200, description: "PDF stream" })
  async getPdf(@Param("id") id: string, @Request() req, @Res() res: Response) {
    const invoice = await this.invoicesService.findOne(id, req.user.id);
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoice.number}.pdf"`,
    );

    res.send(pdfBuffer);
  }

  @Post()
  @ApiOperation({ summary: "Create a new invoice" })
  @ApiResponse({ status: 201, description: "Invoice created" })
  create(@Request() req, @Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(req.user.id, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an invoice" })
  update(
    @Param("id") id: string,
    @Request() req,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, req.user.id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an invoice" })
  remove(@Param("id") id: string, @Request() req) {
    return this.invoicesService.remove(id, req.user.id);
  }
}
