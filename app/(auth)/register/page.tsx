'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { AuthSplitLayout } from '@/components/auth-split-layout';
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
    <AuthSplitLayout
      imageUrl="/register-illustration.jpg"
      imageAlt="Espace de travail moderne et lumineux"
      tagline="Rejoignez des milliers d'entrepreneurs qui font confiance à Faktiir pour gérer leur activité."
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1.5">
          <Text
            size="lg"
            weight="semibold"
            className="font-heading text-foreground"
          >
            Créer un compte
          </Text>
          <Text size="sm" variant="muted">
            Renseignez vos informations pour démarrer gratuitement.
          </Text>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  value.length < 2 ? 'Au moins 2 caractères' : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Nom complet *</Label>
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
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>
                    Entreprise{' '}
                    <span className="font-normal text-muted-foreground">
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
          </div>

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
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>E-mail *</Label>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="vous@exemple.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  autoComplete="email"
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
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Mot de passe *</Label>
                <Input
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  autoComplete="new-password"
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
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner className="size-3.5" />}
            Créer mon compte
          </Button>
        </form>

        <Separator />

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
    </AuthSplitLayout>
  );
}
