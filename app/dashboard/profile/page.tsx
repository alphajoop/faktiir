'use client';

import { AlertCircleIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const { user, isLoading, error } = useUser();

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Loader2 className="text-primary h-14 w-14 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <div className="flex h-[calc(80vh-4rem)] items-center justify-center">
        <Alert variant="destructive" className="w-[calc(80vh-4rem)]">
          <AlertCircleIcon />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Impossible de charger les informations du profil'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Mon Profil
          </h1>
          <p className="text-muted-foreground mt-1 text-base md:text-lg">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Mettez à jour vos informations de profil et de facturation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <ProfileForm user={user} />
          ) : (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Impossible de charger les informations du profil
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
