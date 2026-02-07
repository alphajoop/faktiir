'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Info, Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { sendOtp } from '@/lib/api';
import { cn } from '@/lib/utils';

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'Le code doit contenir 6 chiffres')
    .max(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir 6 chiffres'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function VerifyOtpForm({
  email,
  className,
  ...props
}: { email: string } & React.ComponentProps<'form'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams?.get('email') || '';
  const finalEmail =
    email && email.trim().length > 0
      ? email
      : emailFromQuery
        ? decodeURIComponent(emailFromQuery)
        : '';

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: OtpFormValues) => {
    console.log('email', email);
    try {
      setLoading(true);
      setErrorMsg(null);
      setInfoMsg(null);

      if (!finalEmail) {
        setErrorMsg('Email manquant pour la vérification');
        return;
      }

      const callbackUrl = '/dashboard';

      const result = await signIn('otp', {
        email: finalEmail,
        otp: data.otp,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setErrorMsg('Code invalide ou expiré');
        return;
      }

      setInfoMsg('Email vérifié avec succès');
      router.push(callbackUrl);
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMsg(e.message || 'Une erreur est survenue');
      } else {
        setErrorMsg('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      setResending(true);
      setErrorMsg(null);
      setInfoMsg(null);

      if (!finalEmail) {
        setErrorMsg("Email manquant pour l'envoi du code");
        return;
      }
      const res = await sendOtp({ email: finalEmail });
      if (res?.error) {
        setErrorMsg(res.message || "Échec de l'envoi du code");
        return;
      }

      setInfoMsg(res?.message || 'Un nouveau code a été envoyé');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMsg(e.message || "Échec de l'envoi du code");
      } else {
        setErrorMsg("Échec de l'envoi du code");
      }
    } finally {
      setResending(false);
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
            <h1 className="text-2xl font-bold">Vérification de l’email</h1>
            <p className="text-muted-foreground text-sm">
              Entrez le code à 6 chiffres envoyé à {finalEmail || 'votre email'}
            </p>
          </div>
          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
          {infoMsg && (
            <Alert className="mb-4" variant="info">
              <Info />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>{infoMsg}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code OTP</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : 'Vérifier'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onResend}
              disabled={resending}
            >
              {resending ? (
                <Loader className="animate-spin" />
              ) : (
                'Renvoyer le code'
              )}
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Mauvais email ?{' '}
            <a
              href="/register"
              className="hover:text-primary underline underline-offset-4"
            >
              Modifier
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
}
