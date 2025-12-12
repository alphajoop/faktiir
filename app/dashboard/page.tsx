'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircleIcon,
  Loader2,
  Plus,
  ArrowRight,
  Eye,
  Download,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { InvoiceStats } from '@/components/dashboard/invoice-stats';
import { useInvoices } from '@/hooks/use-invoices';
import Link from 'next/link';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { PDFViewerDialog } from '@/components/shared/pdf-viewer-dialog';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const {
    invoices,
    recentInvoices,
    pagination,
    isLoading,
    error,
    handleViewPDF,
    handleDownloadPDF,
    handleDelete,
    setPage,
    setLimit,
    deleteDialogOpen,
    confirmDelete,
    cancelDelete,
    isDeleting,
    selectedInvoice,
    pdfViewerOpen,
    setPdfViewerOpen,
    pdfUrl,
    isPdfLoading,
    pdfError,
  } = useInvoices();

  if (status === 'loading' || isLoading)
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Loader2 className="text-primary h-14 w-14 animate-spin" />
      </div>
    );
  if (status === 'unauthenticated') {
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Alert variant="destructive" className="w-[calc(80vh-4rem)]">
          <AlertCircleIcon />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Veuillez vous connecter pour accéder à cette page
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  if (error)
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Alert variant="destructive" className="w-[calc(80vh-4rem)]">
          <AlertCircleIcon />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Bonjour, {session?.user.name || 'Utilisateur'} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-base md:text-lg">
            Gérez vos factures de façon simple et locale.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      <InvoiceStats invoices={invoices} />

      {/* Recent Invoices */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Factures récentes</CardTitle>
            <CardDescription>Les 5 dernières factures créées</CardDescription>
          </div>
          <Link href="/dashboard/invoices">
            <Button variant="outline" className="gap-2">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              Aucune facture pour le moment
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNo}
                      </TableCell>
                      <TableCell
                        className="max-w-[150px] truncate"
                        title={invoice.clientName}
                      >
                        {invoice.clientName}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {invoice.total.toLocaleString()} CFA
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPDF(invoice)}
                            className="gap-1"
                            title="Aperçu du PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(invoice)}
                            className="gap-1"
                            title="Télécharger PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
                            className="text-destructive hover:text-destructive gap-1"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <PDFViewerDialog
        open={pdfViewerOpen}
        onOpenChange={setPdfViewerOpen}
        invoice={selectedInvoice}
        isLoading={isPdfLoading}
        pdfUrl={pdfUrl}
        error={pdfError}
      />
    </div>
  );
}
