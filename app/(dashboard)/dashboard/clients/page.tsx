import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ClientsDataTable } from './data-table';

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        actions={
          <Button size="sm" asChild>
            <Link href="/dashboard/clients/new">
              <PlusIcon />
              Nouveau client
            </Link>
          </Button>
        }
      />
      <ClientsDataTable />
    </>
  );
}
