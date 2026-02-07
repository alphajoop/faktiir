'use client';

import { AlertCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <FaktiirIcon className="size-4" />
              </div>
              <span className="logo-text">Faktiir.</span>
            </Link>
            <ModeToggle />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Lien de réinitialisation invalide ou expiré. Veuillez demander
                  un nouveau lien.
                </AlertDescription>
              </Alert>
              <Button asChild variant="outline" className="w-full">
                <Link href="/forgot-password">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Demander un nouveau lien
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <div className="absolute inset-0 z-10 bg-linear-to-b from-black/60 to-black/40"></div>
          <Image
            src="/login-illustration.jpg"
            alt="Image"
            className="saturate(1.2) absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.4] dark:grayscale"
            fill
          />
          <div className="text-background dark:text-foreground absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 p-8 text-center">
            <h2 className="text-4xl font-bold">
              Réinitialisation de mot de passe
            </h2>
            <p className="text-background/70 dark:text-foreground/70 max-w-md text-lg">
              Entrez votre nouveau mot de passe pour sécuriser votre compte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <FaktiirIcon className="size-4" />
            </div>
            <span className="logo-text">Faktiir.</span>
          </Link>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 z-10 bg-linear-to-b from-black/60 to-black/40"></div>
        <Image
          src="/login-illustration.jpg"
          alt="Image"
          className="saturate(1.2) absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.4] dark:grayscale"
          fill
        />
        <div className="text-background dark:text-foreground absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <h2 className="text-4xl font-bold">
            Réinitialisation de mot de passe
          </h2>
          <p className="text-background/70 dark:text-foreground/70 max-w-md text-lg">
            Entrez votre nouveau mot de passe pour sécuriser votre compte.
          </p>
        </div>
      </div>
    </div>
  );
}
