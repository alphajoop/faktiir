'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateInvoice } from '@/types/invoice';
import { createInvoice } from '@/lib/api/invoices';

type CreateInvoiceData = Omit<
  CreateInvoice,
  'itemsJson' | 'subtotal' | 'total' | 'pdfPath' | 'createdAt'
> & {
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  total: number;
};

export function useCreateInvoice() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateInvoiceData) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Formatage des données pour l'API
      const formattedData = {
        ...data,
        itemsJson: JSON.stringify(data.items),
        subtotal: data.subtotal,
        total: data.total,
      };

      return createInvoice(session, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Facture créée avec succès');
      router.push('/dashboard/invoices');
    },
    onError: (error: Error) => {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error(
        error.message ||
          'Une erreur est survenue lors de la création de la facture',
      );
    },
  });
}
