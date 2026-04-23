'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ClientForm, type ClientFormValues } from '@/components/client-form';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useClient, useUpdateClient } from '@/lib/hooks';

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: client, isLoading } = useClient(id);
  const updateClient = useUpdateClient();

  const handleSubmit = (values: ClientFormValues) => {
    updateClient.mutate(
      { id, ...values },
      {
        onSuccess: (c) => {
          toast.success(`Client "${c.name}" mis à jour`);
          router.push('/dashboard/clients');
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  return (
    <>
      <PageHeader
        title={`Modifier ${client?.name ?? 'le client'}`}
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
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map(() => (
                <div key={Math.random()} className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          ) : client ? (
            <ClientForm
              defaultValues={{
                name: client.name,
                email: client.email ?? '',
                phone: client.phone ?? '',
                address: client.address ?? '',
              }}
              onSubmit={handleSubmit}
              isPending={updateClient.isPending}
              cancelHref="/dashboard/clients"
              submitLabel="Enregistrer"
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
