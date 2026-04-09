'use client';

import Link from 'next/link';
import { DatePicker } from '@/components/date-picker';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/typography';
import type { Client } from '@/lib/api';

interface InvoiceGeneralSectionProps {
  clients: Client[] | undefined;
  clientId: string;
  issueDate: string;
  dueDate: string;
  clientIdError?: string;
  onClientChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
}

export function InvoiceGeneralSection({
  clients,
  clientId,
  issueDate,
  dueDate,
  clientIdError,
  onClientChange,
  onIssueDateChange,
  onDueDateChange,
}: InvoiceGeneralSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
      <Text size="sm" weight="semibold">
        Informations générales
      </Text>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Client */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Client *</Label>
          {clients?.length === 0 ? (
            <div className="rounded-md border border-border bg-muted/30 p-4 text-center">
              <Text size="sm" variant="muted">
                Aucun client.{' '}
                <Link
                  href="/dashboard/clients/new"
                  className="text-primary underline-offset-4 hover:underline font-medium"
                >
                  Créer un client
                </Link>
              </Text>
            </div>
          ) : (
            <Select value={clientId} onValueChange={onClientChange}>
              <SelectTrigger
                className={clientIdError ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Sélectionner un client…" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {clientIdError && (
            <Text size="xs" variant="destructive">
              {clientIdError}
            </Text>
          )}
        </div>

        {/* Issue date */}
        <div className="flex flex-col gap-1.5">
          <Label>Date d&apos;émission *</Label>
          <DatePicker value={issueDate} onChange={onIssueDateChange} />
        </div>

        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <Label>Date d&apos;échéance *</Label>
          <DatePicker value={dueDate} onChange={onDueDateChange} />
        </div>
      </div>
    </section>
  );
}
