'use client';

import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/typography';

export const clientSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
  email: z.union([z.email('E-mail invalide'), z.literal('')]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
  isPending?: boolean;
  cancelHref: string;
  submitLabel?: string;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  isPending,
  cancelHref,
  submitLabel = 'Enregistrer',
}: ClientFormProps) {
  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      address: defaultValues?.address ?? '',
    },
    onSubmit: async ({ value }) => {
      const parsed = clientSchema.safeParse(value);
      if (!parsed.success) return;
      await onSubmit(parsed.data);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 2 ? 'Au moins 2 caractères' : undefined,
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>Nom *</Label>
            <Input
              id={field.name}
              placeholder="Acme Corp"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
            />
            {field.state.meta.errors.length > 0 && (
              <Text size="xs" variant="destructive">
                {field.state.meta.errors[0]}
              </Text>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return undefined;
            const r = z.email().safeParse(value);
            return r.success ? undefined : 'E-mail invalide';
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>
              E-mail{' '}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </Label>
            <Input
              id={field.name}
              type="email"
              placeholder="contact@acme.com"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
            />
            {field.state.meta.errors.length > 0 && (
              <Text size="xs" variant="destructive">
                {field.state.meta.errors[0]}
              </Text>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="phone">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>
              Téléphone{' '}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </Label>
            <Input
              id={field.name}
              type="tel"
              placeholder="+221 77 000 00 00"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="address">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>
              Adresse{' '}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </Label>
            <Input
              id={field.name}
              placeholder="Rue des Almadies, Dakar"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Annuler</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner className="mr-2 size-3.5" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
