import Image from 'next/image';
import Link from 'next/link';
import { VerifyOtpForm } from '@/components/auth/verify-otp-form';
import FaktiirIcon from '@/components/icons/faktiir-icon';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default async function VerifyOtpIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params?.email ? decodeURIComponent(params.email) : '';
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
            <VerifyOtpForm email={email} />
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
          <h2 className="text-4xl font-bold">Bienvenue sur Faktiir</h2>
          <p className="text-background/70 dark:text-foreground/70 max-w-md text-lg">
            Vérifiez votre email pour vous connecter.
          </p>
          <Button asChild>
            <Link href="/login">Retour à la page de connexion</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
