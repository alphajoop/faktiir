import { Module } from "@nestjs/common";
import { PdfModule } from "../pdf/pdf.module";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";

@Module({
  imports: [PdfModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
