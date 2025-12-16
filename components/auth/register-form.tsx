'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { register } from '@/lib/api';
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

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setLoading(false);

      const qs = new URLSearchParams({ email: res.user.email }).toString();
      router.push(`/verify-otp?${qs}`);
      router.refresh();
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        setErrorMsg(
          error.message ||
            "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        );
      } else {
        setErrorMsg(
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        );
      }
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
            <h1 className="text-2xl font-bold">Inscription</h1>
            <p className="text-muted-foreground text-sm">
              Créez votre compte en remplissant les informations ci-dessous
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom / Société</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Votre nom ou nom de la société"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <InputPassword placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : "S'inscrire"}
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Vous avez déjà un compte ?{' '}
            <a
              href="/login"
              className="hover:text-primary underline underline-offset-4"
            >
              Connectez-vous
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
}
