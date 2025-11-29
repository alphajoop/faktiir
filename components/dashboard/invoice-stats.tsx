'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Invoice } from '@/types/invoice';
import { DollarSign, FileText, BarChart2, Landmark } from 'lucide-react';

interface InvoiceStatsProps {
  invoices: Invoice[];
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalInvoices = invoices.length;
  const averageInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
  const totalTax = invoices.reduce((sum, inv) => sum + inv.tax, 0);

  const stats = [
    {
      label: 'Revenu total',
      value: `${totalRevenue.toLocaleString()} CFA`,
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      color: 'from-blue-500/20 to-blue-500/5',
    },
    {
      label: 'Nombre de factures',
      value: totalInvoices.toString(),
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      color: 'from-purple-500/20 to-purple-500/5',
    },
    {
      label: 'Facture moyenne',
      value: `${averageInvoice.toLocaleString(undefined, { maximumFractionDigits: 0 })} CFA`,
      icon: <BarChart2 className="h-5 w-5 text-green-500" />,
      color: 'from-green-500/20 to-green-500/5',
    },
    {
      label: 'Total des taxes',
      value: `${totalTax.toLocaleString()} CFA`,
      icon: <Landmark className="h-5 w-5 text-orange-500" />,
      color: 'from-orange-500/20 to-orange-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border bg-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </CardTitle>
              <div className="bg-opacity-20 bg-primary/10 rounded-lg p-2">
                {stat.icon}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`bg-linear-to-br text-2xl font-bold ${stat.color} rounded-lg p-3`}
            >
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
