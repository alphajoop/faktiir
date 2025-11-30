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
  Eye,
  Download,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useInvoices } from '@/hooks/use-invoices';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { PDFViewerDialog } from '@/components/shared/pdf-viewer-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function InvoicePage() {
  const { data: session, status } = useSession();
  const {
    invoices,
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

      {/* Liste des factures */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Factures</CardTitle>
            <CardDescription>La liste complète de vos factures</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              Aucune facture pour le moment
            </p>
          ) : (
            <div className="space-y-4">
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
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNo}
                      </TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
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

              {/* Pagination */}
              <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-muted-foreground text-sm">
                    Lignes par page :
                  </p>
                  <Select
                    value={pagination.limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1); // Reset à la première page lors du changement de limite
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pagination.limit} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50, 100].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-muted-foreground text-sm">
                  Affichage de{' '}
                  <span className="font-medium">
                    {pagination.page === 1
                      ? 1
                      : (pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  à{' '}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{' '}
                  sur <span className="font-medium">{pagination.total}</span>{' '}
                  factures
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page > 1) {
                            setPage(pagination.page - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={
                          pagination.page === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        // Afficher les 5 premières pages, puis '...' et les 2 dernières pages
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              isActive={pagination.page === pageNum}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNum);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      },
                    )}

                    {pagination.totalPages > 5 &&
                      pagination.page < pagination.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.page < pagination.totalPages) {
                            setPage(pagination.page + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={
                          pagination.page === pagination.totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
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
