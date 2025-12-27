'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InvoiceForm } from '@/components/dashboard/invoice-form';

export default function CreateInvoicePage() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Loader2 className="text-primary h-14 w-14 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle facture</CardTitle>
          <CardDescription>
            Remplissez les détails pour créer une nouvelle facture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
