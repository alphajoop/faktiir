'use client';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
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
            <ForgotPasswordForm />
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
          priority
        />
        <div className="text-background dark:text-foreground absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <h2 className="text-4xl font-bold">Mot de passe oublié ?</h2>
          <p className="text-background/70 dark:text-foreground/70 max-w-md text-lg">
            Pas de panique ! Entrez votre email et nous vous enverrons un lien
            pour réinitialiser votre mot de passe.
          </p>
        </div>
      </div>
    </div>
  );
}
