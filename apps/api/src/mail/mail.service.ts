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
}
