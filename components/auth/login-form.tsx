'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alphakhoss@gmail.com',
      password: 'Motdepasse1!',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Get callbackUrl from query params or use default
      const callbackUrl =
        new URLSearchParams(window.location.search).get('callbackUrl') ||
        '/dashboard';

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setErrorMsg('Email ou mot de passe incorrect');
        return;
      }

      const session = await getSession();
      if (session?.user && session.user.emailVerified === false) {
        const qs = new URLSearchParams({ email: data.email }).toString();
        router.push(`/verify-otp?${qs}`);
        router.refresh();
        return;
      }

      // If no error, redirect to callbackUrl or dashboard
      router.push(callbackUrl);
      router.refresh(); // Ensure the page updates with the new session
      toast.success('Connexion reussie', {
        description: `Heureux de vous revoir ${data.email}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className="flex w-full flex-col gap-7">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Connexion à votre compte</h1>
            <p className="text-muted-foreground text-sm">
              Entrez votre e-mail et mot de passe pour vous connecter
            </p>
          </div>
          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemple@domaine.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <InputPassword placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : 'Se connecter'}
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Vous n&apos;avez pas de compte ?{' '}
            <a
              href="/register"
              className="hover:text-primary underline underline-offset-4"
            >
              Inscrivez-vous
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
}
