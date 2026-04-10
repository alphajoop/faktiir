'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { AuthSplitLayout } from '@/components/auth-split-layout';
import { SearchParamsProvider } from '@/components/search-params-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/typography';
import { auth } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export default function LoginPage() {
  return (
    <SearchParamsProvider>
      {(searchParams) => <LoginPageContent searchParams={searchParams} />}
    </SearchParamsProvider>
  );
}

function LoginPageContent({ searchParams }: { searchParams: URLSearchParams }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const from = searchParams.get('from') ?? '/dashboard';

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof loginSchema>) => auth.login(values),
    onSuccess: (data) => {
      setUser(data.user);
      router.push(from);
    },
    onError: (err) => {
      toast.error(err.message ?? 'Identifiants incorrects');
    },
  });

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value);
      if (!parsed.success) return;
      mutation.mutate(parsed.data);
    },
  });

  return (
    <AuthSplitLayout
      imageUrl="/login-illustration.jpg"
      imageAlt="Bureau épuré avec documents de comptabilité"
      tagline="Simplifiez votre facturation, concentrez-vous sur ce qui compte vraiment."
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1.5">
          <Text
            size="lg"
            weight="semibold"
            className="font-heading text-foreground"
          >
            Connexion
          </Text>
          <Text size="sm" variant="muted">
            Entrez vos identifiants pour accéder à votre espace.
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
                <Label htmlFor={field.name}>E-mail</Label>
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
                value.length < 1 ? 'Mot de passe requis' : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.name}>Mot de passe</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id={field.name}
                  type="password"
                  placeholder="###"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  autoComplete="current-password"
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
            Se connecter
          </Button>
        </form>

        <Separator />

        <Text size="sm" variant="muted" className="text-center">
          Pas encore de compte ?{' '}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Créer un compte
          </Link>
        </Text>
      </div>
    </AuthSplitLayout>
  );
}
