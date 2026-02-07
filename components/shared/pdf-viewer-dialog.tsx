'use client';

import { AlertCircleIcon, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Invoice } from '@/types/invoice';

interface PDFViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  isLoading?: boolean;
  pdfUrl?: string | null;
  error?: string | null;
}

export function PDFViewerDialog({
  open,
  onOpenChange,
  invoice,
  isLoading = false,
  pdfUrl,
  error,
}: PDFViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card flex h-[90vh] max-w-7xl flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-foreground">
            {invoice ? `Facture ${invoice.invoiceNo}` : 'Aperçu du PDF'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 items-center justify-center">
          {isLoading ? (
            <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
              <Loader2 className="text-primary h-14 w-14 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex h-[calc(80vh-4rem)] w-full items-center justify-center">
              <Alert variant="destructive" className="w-full">
                <AlertCircleIcon />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="h-[calc(80vh-4rem)] w-full rounded-lg border-0"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
              <p className="text-muted-foreground text-center">
                Aucun PDF à afficher
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
