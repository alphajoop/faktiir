import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer-core";
import { InvoiceData, invoiceTemplate } from "./templates/invoice.template";

@Injectable()
export class PdfService {
  async generateInvoicePdf(invoice: InvoiceData): Promise<Buffer> {
    const chromium = (await import("@sparticuz/chromium")).default;
    const isProd = process.env.NODE_ENV === "production";

    const browser = await puppeteer.launch({
      args: isProd ? chromium.args : [],
      executablePath: isProd
        ? await chromium.executablePath()
        : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Windows Chrome
      headless: true,
    });

    try {
      const page = await browser.newPage();

      await page.emulateMediaType("screen");
      await page.setContent(invoiceTemplate(invoice), {
        waitUntil: "networkidle0", // wait for logo image (if any) to load
      });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true, // required for background colors
        preferCSSPageSize: true, // respect CSS page size
        margin: { top: "0", right: "0", bottom: "0", left: "0" }, // no margins - strict A4
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
