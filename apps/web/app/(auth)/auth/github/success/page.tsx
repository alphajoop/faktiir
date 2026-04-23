'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/typography';
import { useAuth } from '@/lib/auth-context';

/**
 * Page de callback GitHub OAuth
 * L'API a déjà posé le cookie httpOnly — on a juste besoin de recharger le user
 *
 * Route: /auth/github/success
 */
export default function GithubSuccessPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  useEffect(() => {
    refresh()
      .then(() => {
        toast.success('Connecté avec GitHub !');
        router.replace('/dashboard');
      })
      .catch(() => {
        toast.error('Erreur lors de la connexion GitHub');
        router.replace('/login?error=github');
      });
  }, [refresh, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Spinner className="size-6 text-muted-foreground" />
      <Text size="sm" variant="muted">
        Connexion en cours…
      </Text>
    </div>
  );
}
