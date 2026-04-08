'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ClientForm, type ClientFormValues } from '@/components/client-form';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useCreateClient } from '@/lib/hooks';

export default function NewClientPage() {
  const router = useRouter();
  const createClient = useCreateClient();

  const handleSubmit = (values: ClientFormValues) => {
    createClient.mutate(values, {
      onSuccess: (client) => {
        toast.success(`Client "${client.name}" créé`);
        router.push('/dashboard/clients');
      },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <>
      <PageHeader
        title="Nouveau client"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeftIcon />
              Retour
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="mx-auto w-full max-w-lg rounded-xl border border-border bg-card p-6">
          <ClientForm
            onSubmit={handleSubmit}
            isPending={createClient.isPending}
            cancelHref="/dashboard/clients"
            submitLabel="Créer le client"
          />
        </div>
      </div>
    </>
  );
}
