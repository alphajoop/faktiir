'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { invoices } from '@/lib/api';

export function useDownloadPdf() {
  const [isPending, setIsPending] = useState(false);

  const download = async (invoiceId: string, invoiceNumber: string) => {
    setIsPending(true);
    try {
      const pdfUrl = invoices.pdfUrl(invoiceId);

      const res = await fetch(pdfUrl, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors du téléchargement');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur PDF');
    } finally {
      setIsPending(false);
    }
  };

  return { download, isPending };
}
