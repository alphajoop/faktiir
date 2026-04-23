import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface MonthlyRevenue {
  month: number; // 1-12
  label: string; // "Jan", "Fév" …
  revenue: number;
  count: number;
}

export interface TopClient {
  id: string;
  name: string;
  email: string | null;
  total: number;
  invoiceCount: number;
  paidCount: number;
}

export interface AnalyticsData {
  year: number;
  // Totaux
  totalRevenue: number; // CA payé
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  pendingInvoices: number;
  paymentRate: number; // % des factures payées
  avgInvoiceValue: number; // valeur moyenne d'une facture
  // Par mois
  monthlyRevenue: MonthlyRevenue[];
  // Top clients
  topClients: TopClient[];
  // Comparaison avec l'année précédente
  prevYearRevenue: number;
  revenueGrowth: number | null; // % de croissance
}

const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(userId: string, year: number): Promise<AnalyticsData> {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const prevStart = new Date(year - 1, 0, 1);
    const prevEnd = new Date(year, 0, 1);

    // Toutes les factures de l'année
    const invoices = await this.prisma.invoice.findMany({
      where: {
        userId,
        issueDate: { gte: start, lt: end },
      },
      include: { client: true },
    });

    // CA année précédente
    const prevInvoices = await this.prisma.invoice.findMany({
      where: {
        userId,
        status: "PAID",
        issueDate: { gte: prevStart, lt: prevEnd },
      },
      select: { total: true },
    });

    const prevYearRevenue = prevInvoices.reduce((s, i) => s + i.total, 0);

    // Agrégations de base
    const paid = invoices.filter((i) => i.status === "PAID");
    const overdue = invoices.filter((i) => i.status === "OVERDUE");
    const pending = invoices.filter(
      (i) => i.status === "DRAFT" || i.status === "SENT",
    );

    const totalRevenue = paid.reduce((s, i) => s + i.total, 0);
    const totalInvoices = invoices.length;
    const paymentRate =
      totalInvoices > 0 ? Math.round((paid.length / totalInvoices) * 100) : 0;
    const avgInvoiceValue =
      totalInvoices > 0 ? Math.round(totalRevenue / (paid.length || 1)) : 0;

    // CA par mois (uniquement les factures PAID)
    const monthlyMap: Record<number, { revenue: number; count: number }> = {};
    for (let m = 1; m <= 12; m++) monthlyMap[m] = { revenue: 0, count: 0 };

    for (const inv of paid) {
      const m = new Date(inv.issueDate).getMonth() + 1;
      monthlyMap[m].revenue += inv.total;
      monthlyMap[m].count += 1;
    }

    const monthlyRevenue: MonthlyRevenue[] = Array.from(
      { length: 12 },
      (_, i) => ({
        month: i + 1,
        label: MONTH_LABELS[i],
        revenue: Math.round(monthlyMap[i + 1].revenue),
        count: monthlyMap[i + 1].count,
      }),
    );

    // Top clients — par CA payé
    const clientMap: Record<
      string,
      {
        name: string;
        email: string | null;
        total: number;
        invoiceCount: number;
        paidCount: number;
      }
    > = {};

    for (const inv of invoices) {
      const cid = inv.clientId;
      if (!clientMap[cid]) {
        clientMap[cid] = {
          name: inv.client.name,
          email: inv.client.email,
          total: 0,
          invoiceCount: 0,
          paidCount: 0,
        };
      }
      clientMap[cid].invoiceCount += 1;
      if (inv.status === "PAID") {
        clientMap[cid].total += inv.total;
        clientMap[cid].paidCount += 1;
      }
    }

    const topClients: TopClient[] = Object.entries(clientMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const revenueGrowth =
      prevYearRevenue > 0
        ? Math.round(((totalRevenue - prevYearRevenue) / prevYearRevenue) * 100)
        : null;

    return {
      year,
      totalRevenue: Math.round(totalRevenue),
      totalInvoices,
      paidInvoices: paid.length,
      overdueInvoices: overdue.length,
      pendingInvoices: pending.length,
      paymentRate,
      avgInvoiceValue,
      monthlyRevenue,
      topClients,
      prevYearRevenue: Math.round(prevYearRevenue),
      revenueGrowth,
    };
  }
}
