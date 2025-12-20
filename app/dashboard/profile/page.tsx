'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { getCurrentUser, type User } from '@/lib/api/users';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === 'authenticated') {
      getCurrentUser(session)
        .then(setUser)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
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
