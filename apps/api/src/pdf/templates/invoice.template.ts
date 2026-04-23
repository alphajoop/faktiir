interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  user: {
    companyName?: string | null;
    name: string;
    email: string;
    logoUrl?: string | null;
  };
  number: string;
  issueDate: string | Date;
  dueDate: string | Date;
  status: string;
  client: {
    name: string;
    email?: string | null;
    address?: string | null;
    phone?: string | null;
  };
  items: InvoiceItem[];
  tax: number;
  total: number;
  notes?: string | null;
}

const T = {
  primary: "#5b4fe8",
  primaryLight: "#ede9fe",
  pageBg: "#ffffff",
  cardBg: "#f9f9fc",
  sectionBg: "#f3f3f8",
  textDark: "#1a1a2e",
  textMuted: "#6b6b8a",
  textLight: "#ffffff",
  border: "#e2e2ef",
  statusDraft: { bg: "#e5e7eb", text: "#374151", label: "Brouillon" },
  statusSent: { bg: "#dbeafe", text: "#1e40af", label: "Envoyée" },
  statusPaid: { bg: "#dcfce7", text: "#166534", label: "Payée" },
  statusOverdue: { bg: "#fee2e2", text: "#991b1b", label: "En retard" },
} as const;

function getStatus(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: T.statusDraft,
    SENT: T.statusSent,
    PAID: T.statusPaid,
    OVERDUE: T.statusOverdue,
  };
  return map[status] ?? T.statusDraft;
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string | Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export function invoiceTemplate(invoice: InvoiceData): string {
  const sc = getStatus(invoice.status);

  const emitterName = invoice.user.companyName ?? invoice.user.name;

  const subtotal = invoice.items.reduce((s, i) => s + i.total, 0);
  const taxAmount = (subtotal * invoice.tax) / 100;

  const itemRows = invoice.items
    .map(
      (item) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid ${T.border};color:${T.textDark}">
          ${item.description}
        </td>
        <td style="text-align:center;padding:16px 0;border-bottom:1px solid ${T.border};color:${T.textMuted}">
          ${item.quantity}
        </td>
        <td style="text-align:right;padding:16px 0;border-bottom:1px solid ${T.border};color:${T.textMuted}">
          ${fmt(item.unitPrice)}
        </td>
        <td style="text-align:right;padding:16px 0;border-bottom:1px solid ${T.border};font-weight:600;color:${T.textDark}">
          ${fmt(item.total)}
        </td>
      </tr>
    `,
    )
    .join("");

  const logoHtml = invoice.user.logoUrl
    ? `<img src="${invoice.user.logoUrl}" style="height:38px;margin-bottom:12px" />`
    : "";

  const clientInfo = [
    invoice.client.email,
    invoice.client.address,
    invoice.client.phone,
  ]
    .filter(Boolean)
    .join("<br/> ");

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Facture #${invoice.number} - ${emitterName}</title>
<meta name="description" content="Facture ${invoice.number} générée pour ${invoice.client.name}" />
<style>
  html, body{
    width:210mm;
    height:297mm;
    margin:0;
    padding:0;
    overflow:hidden;
  }

  *{
    box-sizing:border-box;
    line-height:1.2;
    word-break:break-word;
  }

  body{
    font-family: Inter, Arial, sans-serif;
    background:${T.pageBg};
    color:${T.textDark};
  }

  .container{
    width:210mm;
    height:297mm;
    padding:20mm;
    box-sizing:border-box;
    overflow:hidden;
    position:relative;
  }

  .header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:40px;
  }

  .title{
    font-size:22px;
    font-weight:700;
    letter-spacing:-0.4px;
  }

  .subtitle{
    font-size:12px;
    color:${T.textMuted};
  }

  .badge{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:6px 12px;
    border-radius:999px;
    font-size:12px;
    font-weight:600;
    border:1px solid ${sc.text}30;
    background:${sc.bg};
    color:${sc.text};
  }

  .grid{
    display:flex;
    gap:16px;
    margin-bottom:30px;
  }

  .card{
    flex:1;
    background:${T.cardBg};
    border:1px solid ${T.border};
    border-radius:12px;
    padding:16px;
  }

  table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
    page-break-inside:auto;
  }

  tr{
    page-break-inside:avoid;
  }

  thead th{
    text-align:left;
    font-size:11px;
    color:${T.textMuted};
    font-weight:600;
    padding-bottom:10px;
  }

  .totals{
    margin-top:30px;
    width:340px;
    margin-left:auto;
  }

  .row{
    display:flex;
    justify-content:space-between;
    padding:6px 0;
    font-size:13px;
  }

  .totalBox{
    background:${T.primary};
    color:white;
    padding:16px;
    border-radius:12px;
    margin-top:10px;
    display:flex;
    justify-content:space-between;
    font-weight:700;
    font-size:15px;
  }

  footer{
    position:absolute;
    bottom:20mm;
    left:0;
    right:0;
    text-align:center;
    font-size:11px;
    color:${T.textMuted};
  }
</style>
</head>

<body>
<div class="container">

  <!-- EN-TÊTE -->
  <div class="header">

    <div>
      ${logoHtml}
      <div class="title">FACTURE</div>
      <div class="subtitle">N° ${invoice.number}</div>
    </div>

    <div style="text-align:right">
      <div class="badge">${sc.label}</div>
      <div class="subtitle" style="margin-top:10px">
        Émission : ${fmtDate(invoice.issueDate)}<br/>
        Échéance : ${fmtDate(invoice.dueDate)}
      </div>
    </div>

  </div>

  <!-- CLIENT / ÉMETTEUR -->
  <div class="grid">

    <div class="card">
      <div class="subtitle">Émetteur</div>
      <div style="font-weight:700;margin-top:6px">${emitterName}</div>
      <div class="subtitle">${invoice.user.email}</div>
    </div>

    <div class="card">
      <div class="subtitle">Client</div>
      <div style="font-weight:700;margin-top:6px">${invoice.client.name}</div>
      <div class="subtitle">${clientInfo || ""}</div>
    </div>

  </div>

  <!-- TABLE -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:center">Qté</th>
        <th style="text-align:right">Prix unitaire</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- TOTAUX -->
  <div class="totals">

    <div class="row">
      <span style="color:${T.textMuted}">Sous-total</span>
      <span>${fmt(subtotal)}</span>
    </div>

    <div class="row">
      <span style="color:${T.textMuted}">TVA (${invoice.tax}%)</span>
      <span>${fmt(taxAmount)}</span>
    </div>

    <div class="totalBox">
      <span>Total TTC</span>
      <span>${fmt(invoice.total)}</span>
    </div>

  </div>

  <!-- FOOTER -->
  <footer>
    Document généré automatiquement par 
    <a href="https://faktiir.com" target="_blank" style="color:${T.primary};text-decoration:none;">Faktiir</a>
  </footer>

</div>
</body>
</html>
`;
}
