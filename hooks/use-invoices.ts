import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { deleteInvoice, getInvoicePdf, getInvoices } from '@/lib/api';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseInvoicesParams {
  page?: number;
  limit?: number;
}

export function useInvoices(params: UseInvoicesParams = {}) {
  const { data: session, status } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: params.page || 1,
    limit: params.limit || 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const fetchInvoices = useCallback(async () => {
    if (status === 'loading') return;

    if (!session) {
      setError('Vous devez être connecté pour voir les factures');
      setIsLoading(false);
      return;
    }

    try {
      const response = await getInvoices(session, {
        page: pagination.page,
        limit: pagination.limit,
      });
      setInvoices(response.data);
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Échec du chargement des factures',
      );
    } finally {
      setIsLoading(false);
    }
  }, [session, status, pagination.page, pagination.limit]);

  const handleViewPDF = useCallback(
    async (invoice: Invoice) => {
      setSelectedInvoice(invoice);
      setPdfViewerOpen(true);
      setIsPdfLoading(true);
      setPdfError(null);

      try {
        const blob = await getInvoicePdf(session, invoice.id);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        setPdfError(
          error instanceof Error ? error.message : 'Échec du chargement du PDF',
        );
      } finally {
        setIsPdfLoading(false);
      }
    },
    [session],
  );

  const handleDownloadPDF = useCallback(
    async (invoice: Invoice) => {
      try {
        const blob = await getInvoicePdf(session, invoice.id);
        const url = URL.createObjectURL(blob);

        // Créer un lien temporaire pour télécharger
        const link = document.createElement('a');
        link.href = url;
        link.download = invoice.invoiceNo + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Nettoyer l'URL
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error('Erreur lors du téléchargement', {
          description:
            error instanceof Error
              ? error.message
              : 'Échec du téléchargement du PDF',
        });
        console.error(
          error instanceof Error
            ? error.message
            : 'Échec du téléchargement du PDF',
        );
      }
    },
    [session],
  );

  const handleDelete = useCallback(async (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!invoiceToDelete) return;

    setIsDeleting(true);
    try {
      await deleteInvoice(session, invoiceToDelete);
      toast.success('Facture supprimée', {
        description: 'La facture a été supprimée avec succès.',
      });

      // Refresh the invoice list
      await fetchInvoices();

      // Fermer le dialogue uniquement en cas de succès
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression', {
        description:
          error instanceof Error
            ? error.message
            : 'Échec de la suppression de la facture',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [session, invoiceToDelete, fetchInvoices]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const recentInvoices = invoices.slice(0, 5);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
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
    refetch: fetchInvoices,
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
  };
}
