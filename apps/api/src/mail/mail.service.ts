import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {}

  async sendPasswordResetOtp(
    email: string,
    otp: string,
    name: string,
  ): Promise<void> {
    const resendApiKey = this.config.get<string>("RESEND_API_KEY");
    const fromEmail = this.config.get<string>(
      "RESEND_FROM",
      "FAKTIIR <noreply@faktiir.com>",
    );

    if (!resendApiKey) {
      this.logger.warn("RESEND_API_KEY not set — OTP email skipped");
      this.logger.debug(`[DEV] OTP for ${email}: ${otp}`);
      return;
    }

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e3e8ef;overflow:hidden">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #f0f3f7">
              <span style="font-size:20px;font-weight:700;color:#1a1f36;letter-spacing:-0.5px">FAKTIIR</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px">
              <p style="margin:0 0 8px;font-size:15px;color:#697386">Bonjour ${name},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#1a1f36;line-height:1.6">
                Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification :
              </p>
              <!-- OTP -->
              <div style="background:#f6f9fc;border:1px solid #e3e8ef;border-radius:8px;padding:24px;text-align:center;margin:0 0 24px">
                <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#1a1f36;font-family:'Courier New',monospace">${otp}</span>
              </div>
              <p style="margin:0 0 8px;font-size:13px;color:#697386;line-height:1.6">
                Ce code expire dans <strong>15 minutes</strong>. Si vous n'avez pas fait cette demande, ignorez cet e-mail.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f6f9fc;border-top:1px solid #e3e8ef">
              <p style="margin:0;font-size:12px;color:#a3acb9;text-align:center">
                FAKTIIR · Logiciel de facturation open source · <a href="https://faktiir.com" style="color:#625afa;text-decoration:none">faktiir.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: `${otp} est votre code FAKTIIR`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Resend error ${res.status}: ${body}`);
      throw new Error("Impossible d'envoyer l'e-mail. Réessayez plus tard.");
    }

    this.logger.log(`OTP sent to ${email}`);
  }

  async sendOverdueInvoiceReminder(
    clientEmail: string,
    clientName: string,
    invoiceNumber: string,
    invoiceTotal: number,
    dueDate: Date,
    userCompanyName: string,
  ): Promise<void> {
    const resendApiKey = this.config.get<string>("RESEND_API_KEY");
    const fromEmail = this.config.get<string>(
      "RESEND_FROM",
      "FAKTIIR <noreply@faktiir.com>",
    );

    const formattedTotal = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(invoiceTotal);

    const formattedDue = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(dueDate);

    if (!resendApiKey) {
      this.logger.warn("RESEND_API_KEY not set — overdue reminder skipped");
      this.logger.debug(
        `[DEV] Overdue reminder → ${clientEmail} | ${invoiceNumber} | ${formattedTotal}`,
      );
      return;
    }

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e3e8ef;overflow:hidden">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #f0f3f7">
              <span style="font-size:20px;font-weight:700;color:#1a1f36;letter-spacing:-0.5px">${userCompanyName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px">
              <p style="margin:0 0 8px;font-size:15px;color:#697386">Bonjour ${clientName},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#1a1f36;line-height:1.6">
                Nous vous contactons au sujet de la facture suivante, dont l'échéance est dépassée :
              </p>

              <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:8px;padding:20px 24px;margin:0 0 24px">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#697386;padding-bottom:8px">Numéro de facture</td>
                    <td style="font-size:13px;font-weight:600;color:#1a1f36;text-align:right;padding-bottom:8px">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#697386;padding-bottom:8px">Montant dû</td>
                    <td style="font-size:18px;font-weight:700;color:#dc2626;text-align:right;padding-bottom:8px">${formattedTotal}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#697386">Échéance</td>
                    <td style="font-size:13px;font-weight:600;color:#dc2626;text-align:right">${formattedDue}</td>
                  </tr>
                </table>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#697386;line-height:1.6">
                Nous vous remercions de bien vouloir procéder au règlement dans les meilleurs délais.
                Si vous avez déjà effectué ce paiement, veuillez ignorer ce message.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#f6f9fc;border-top:1px solid #e3e8ef">
              <p style="margin:0;font-size:12px;color:#a3acb9;text-align:center">
                Ce message a été envoyé via <a href="https://faktiir.com" style="color:#625afa;text-decoration:none">Faktiir</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: clientEmail,
        subject: `Rappel : facture ${invoiceNumber} en attente de règlement`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Resend overdue error ${res.status}: ${body}`);
      throw new Error("Impossible d'envoyer le rappel. Réessayez plus tard.");
    }

    this.logger.log(
      `Overdue reminder sent to ${clientEmail} for invoice ${invoiceNumber}`,
    );
  }
}
