import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { InvoicesDataTable } from './data-table';

export default function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Factures"
        actions={
          <Button size="sm" asChild>
            <Link href="/dashboard/invoices/new">
              <PlusIcon />
              Nouvelle facture
            </Link>
          </Button>
        }
      />
      <InvoicesDataTable />
    </>
  );
}
