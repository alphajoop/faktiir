'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/use-subscription';
import { createInvoice } from '@/lib/api/invoices';
import type { CreateInvoice } from '@/types/invoice';

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
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [limitInfo, setLimitInfo] = useState({
    monthlyUsed: 0,
    monthlyQuota: 5,
    isSubscribed: false,
  });

  const { data: subscription } = useSubscription();

  const mutation = useMutation({
    mutationFn: async (data: CreateInvoiceData) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Si on a les infos d'abonnement, vérifier la limite avant d'appeler l'API
      if (subscription && !subscription.isSubscribed) {
        if (subscription.monthlyUsed >= subscription.monthlyQuota) {
          setLimitInfo({
            monthlyUsed: subscription.monthlyUsed,
            monthlyQuota: subscription.monthlyQuota,
            isSubscribed: subscription.isSubscribed,
          });
          setLimitDialogOpen(true);
          throw new Error('Limite atteinte');
        }
      }

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
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Facture créée avec succès');
      router.push('/dashboard/invoices');
    },
    onError: (error: Error | { statusCode?: number; message?: string }) => {
      console.error('Erreur lors de la création de la facture:', error);

      // Vérifier si c'est une erreur 403 (limite atteinte)
      if (error instanceof Error && error.message?.includes('limite')) {
        // Extraire les informations de la limite depuis l'erreur
        const match = error.message?.match(/(\d+)\/(\d+)/);
        if (match) {
          setLimitInfo({
            monthlyUsed: parseInt(match[1], 10),
            monthlyQuota: parseInt(match[2], 10),
            isSubscribed: false,
          });
        } else if (subscription) {
          setLimitInfo({
            monthlyUsed: subscription.monthlyUsed,
            monthlyQuota: subscription.monthlyQuota,
            isSubscribed: subscription.isSubscribed,
          });
        }
        setLimitDialogOpen(true);
      } else {
        toast.error(
          error.message ||
            'Une erreur est survenue lors de la création de la facture',
        );
      }
    },
  });

  return {
    ...mutation,
    limitDialogOpen,
    setLimitDialogOpen,
    limitInfo,
  };
}
