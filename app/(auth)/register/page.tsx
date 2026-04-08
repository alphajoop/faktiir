'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/typography';
import { auth } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const registerSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
  companyName: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof registerSchema>) =>
      auth.register(values),
    onSuccess: (data) => {
      login(data.access_token, data.user);
      router.push('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message ?? "Erreur lors de l'inscription");
    },
  });

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', companyName: '' },
    onSubmit: async ({ value }) => {
      const parsed = registerSchema.safeParse(value);
      if (!parsed.success) return;
      mutation.mutate(parsed.data);
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="mb-6">
        <Text
          size="base"
          weight="semibold"
          className="font-heading text-foreground"
        >
          Créer un compte
        </Text>
        <Text size="sm" variant="muted" className="mt-1">
          Renseignez vos informations pour démarrer.
        </Text>
      </div>

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
              <Label htmlFor={field.name}>Nom complet</Label>
              <Input
                id={field.name}
                placeholder="Jean Dupont"
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

        <form.Field name="companyName">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>
                Nom de l'entreprise{' '}
                <span className="text-muted-foreground font-normal">
                  (optionnel)
                </span>
              </Label>
              <Input
                id={field.name}
                placeholder="Ma Société SARL"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const r = z.email().safeParse(value);
              return r.success ? undefined : 'Adresse e-mail invalide';
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>E-mail</Label>
              <Input
                id={field.name}
                type="email"
                placeholder="vous@exemple.com"
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
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 6 ? 'Au moins 6 caractères' : undefined,
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>Mot de passe</Label>
              <Input
                id={field.name}
                type="password"
                placeholder="••••••••"
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

        <Button
          type="submit"
          className="w-full mt-1"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Spinner className="mr-2 size-3.5" />}
          Créer mon compte
        </Button>
      </form>

      <Separator className="my-5" />

      <Text size="sm" variant="muted" className="text-center">
        Déjà un compte ?{' '}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </Text>
    </div>
  );
}
