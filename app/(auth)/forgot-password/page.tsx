'use client';

import { useForm } from '@tanstack/react-form';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowLeftIcon, CheckCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { AuthSplitLayout } from '@/components/auth-split-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/typography';
import { useForgotPassword, useResetPassword, useVerifyOtp } from '@/lib/hooks';

// Step 1 — Email

function StepEmail({ onNext }: { onNext: (email: string) => void }) {
  const mutation = useForgotPassword();

  const handleSubmit = (email: string) => {
    mutation.mutate(
      { email },
      {
        onSuccess: () => onNext(email),
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      const r = z.email().safeParse(value.email);
      if (!r.success) return;
      handleSubmit(value.email);
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Text size="lg" weight="semibold" className="font-heading">
          Mot de passe oublié
        </Text>
        <Text size="sm" variant="muted">
          Entrez votre adresse e-mail. Si un compte existe, vous recevrez un
          code à 6 chiffres.
        </Text>
      </div>

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
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner className="size-3.5" />}
          Envoyer le code
        </Button>
      </form>

      <Separator />

      <Text size="sm" variant="muted" className="text-center">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeftIcon className="size-3" />
          Retour à la connexion
        </Link>
      </Text>
    </div>
  );
}

// Step 2 — OTP

function StepOtp({
  email,
  onNext,
  onBack,
}: {
  email: string;
  onNext: (otp: string) => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState('');

  const mutation = useVerifyOtp();
  const forgotPasswordMutation = useForgotPassword();

  const handleVerify = (otp: string) => {
    mutation.mutate(
      { email, otp },
      {
        onSuccess: () => onNext(otp),
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  const handleResend = () => {
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => toast.success('Nouveau code envoyé'),
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Entrez les 6 chiffres du code');
      return;
    }
    handleVerify(otp);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Text size="lg" weight="semibold" className="font-heading">
          Vérification
        </Text>
        <Text size="sm" variant="muted">
          Entrez le code à 6 chiffres envoyé à{' '}
          <strong className="text-foreground">{email}</strong>.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          containerClassName="justify-between"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner className="size-3.5" />}
          Vérifier le code
        </Button>
      </form>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeftIcon className="size-3" />
          Changer d'adresse
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={forgotPasswordMutation.isPending}
          className="text-sm font-medium text-primary hover:underline underline-offset-4 disabled:opacity-50"
        >
          {forgotPasswordMutation.isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            'Renvoyer le code'
          )}
        </button>
      </div>
    </div>
  );
}

// Step 3 — New password

function StepNewPassword({ email, otp }: { email: string; otp: string }) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  const mutation = useResetPassword();

  const handleSubmit = (newPassword: string) => {
    mutation.mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => setDone(true),
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  const form = useForm({
    defaultValues: { password: '', confirm: '' },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirm) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }
      handleSubmit(value.password);
    },
  });

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
            <CheckCircle2Icon className="size-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Text size="base" weight="semibold" className="font-heading">
            Mot de passe réinitialisé !
          </Text>
          <Text size="sm" variant="muted">
            Vous pouvez maintenant vous connecter avec votre nouveau mot de
            passe.
          </Text>
        </div>
        <Button className="w-full" onClick={() => router.push('/login')}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Text size="lg" weight="semibold" className="font-heading">
          Nouveau mot de passe
        </Text>
        <Text size="sm" variant="muted">
          Choisissez un mot de passe d'au moins 6 caractères.
        </Text>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 6 ? 'Au moins 6 caractères' : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
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

        <form.Field
          name="confirm"
          validators={{
            onChange: ({ value, fieldApi }) =>
              value !== fieldApi.form.getFieldValue('password')
                ? 'Les mots de passe ne correspondent pas'
                : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirmer le mot de passe</Label>
              <Input
                id="confirm"
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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Spinner className="size-3.5" />}
          Réinitialiser le mot de passe
        </Button>
      </form>
    </div>
  );
}

type Step = 'email' | 'otp' | 'password';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Progress indicator
  const steps: { id: Step; label: string }[] = [
    { id: 'email', label: 'E-mail' },
    { id: 'otp', label: 'Code' },
    { id: 'password', label: 'Mot de passe' },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <AuthSplitLayout
      imageUrl="/forgot-password-illustration.jpg"
      imageAlt="Réinitialisation du mot de passe"
      tagline="Sécurisez votre compte en quelques instants."
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex size-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i < stepIndex
                    ? 'bg-primary text-primary-foreground'
                    : i === stepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < stepIndex ? (
                  <CheckCircle2Icon className="size-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs hidden sm:block ${i === stepIndex ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-8 transition-colors ${i < stepIndex ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 'email' && (
          <StepEmail
            onNext={(e) => {
              setEmail(e);
              setStep('otp');
            }}
          />
        )}
        {step === 'otp' && (
          <StepOtp
            email={email}
            onNext={(o) => {
              setOtp(o);
              setStep('password');
            }}
            onBack={() => setStep('email')}
          />
        )}
        {step === 'password' && <StepNewPassword email={email} otp={otp} />}
      </div>
    </AuthSplitLayout>
  );
}
