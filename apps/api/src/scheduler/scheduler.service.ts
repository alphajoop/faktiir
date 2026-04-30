import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  /**
   * Runs every day at 08:00.
   *
   * 1. Finds all SENT invoices whose dueDate has passed.
   * 2. Marks them OVERDUE in a single bulk update.
   * 3. For each invoice whose client has an email, sends a reminder.
   *
   * The job is idempotent: invoices already OVERDUE are never touched again,
   * so re-runs never send duplicate emails.
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async markOverdueAndNotify(): Promise<void> {
    const now = new Date();
    this.logger.log(`[overdue-check] Running at ${now.toISOString()}`);

    // Fetch candidates before updating so we have full relation data for emails
    const candidates = await this.prisma.invoice.findMany({
      where: {
        status: "SENT",
        dueDate: { lt: now },
      },
      include: {
        client: true,
        user: {
          select: {
            companyName: true,
            name: true,
          },
        },
      },
    });

    if (candidates.length === 0) {
      this.logger.log("[overdue-check] No overdue invoices found.");
      return;
    }

    this.logger.log(
      `[overdue-check] Marking ${candidates.length} invoice(s) as OVERDUE.`,
    );

    // Bulk status update
    await this.prisma.invoice.updateMany({
      where: {
        id: { in: candidates.map((inv) => inv.id) },
      },
      data: { status: "OVERDUE" },
    });

    // Send reminder emails — skip clients without an email address
    const emailJobs = candidates
      .filter((inv) => !!inv.client.email)
      .map((inv) =>
        this.mail
          .sendOverdueInvoiceReminder(
            inv.client.email as string,
            inv.client.name,
            inv.number,
            inv.total,
            inv.dueDate,
            inv.user.companyName ?? inv.user.name,
          )
          .catch((err: Error) => {
            // One failed email must not abort the whole batch
            this.logger.error(
              `[overdue-check] Failed to email client for invoice ${inv.number}: ${err.message}`,
            );
          }),
      );

    await Promise.allSettled(emailJobs);

    const emailCount = candidates.filter((inv) => !!inv.client.email).length;
    this.logger.log(
      `[overdue-check] Done. ${emailCount} reminder email(s) dispatched.`,
    );
  }
}
