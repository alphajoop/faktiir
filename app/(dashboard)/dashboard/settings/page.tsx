'use client';

import { useForm } from '@tanstack/react-form';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { InvoiceNumberingSection } from '@/components/invoice-numbering-section';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Caption, Text } from '@/components/ui/typography';
import { useAuth } from '@/lib/auth-context';
import { useProfile, useUpdateProfile } from '@/lib/hooks';
import { getInitials } from '@/lib/user-utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Au moins 2 caractères'),
  companyName: z.string().optional(),
  logoUrl: z.union([z.url('URL invalide'), z.literal('')]).optional(),
});

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      name: profile?.name ?? user?.name ?? '',
      companyName: profile?.companyName ?? user?.companyName ?? '',
      logoUrl: profile?.logoUrl ?? user?.logoUrl ?? '',
    },
    onSubmit: async ({ value }) => {
      const parsed = profileSchema.safeParse(value);
      if (!parsed.success) return;
      updateProfile.mutate(parsed.data, {
        onSuccess: () => toast.success('Profil mis à jour'),
        onError: (e) => toast.error(e.message),
      });
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.setFieldValue('name', profile.name);
    form.setFieldValue('companyName', profile.companyName ?? '');
    form.setFieldValue('logoUrl', profile.logoUrl ?? '');
  }, [profile, form.setFieldValue]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <PageHeader title="Paramètres" />

      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="mx-auto w-full max-w-2xl flex flex-col gap-6">
          {/* Profile card */}
          <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarFallback className="text-base">
                  {user ? getInitials(user.name) : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Text size="sm" weight="semibold">
                  {user?.name}
                </Text>
                <Caption>{user?.email}</Caption>
              </div>
            </div>

            <Separator />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <Text size="sm" weight="semibold">
                Informations du profil
              </Text>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      value.length < 2 ? 'Au moins 2 caractères' : undefined,
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={field.name}>Nom complet *</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={field.state.meta.errors.length > 0}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <Text size="xs" variant="destructive">
                          {field.state.meta.errors[0]}
                        </Text>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="companyName">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={field.name}>
                        Entreprise{' '}
                        <span className="text-muted-foreground font-normal">
                          (optionnel)
                        </span>
                      </Label>
                      <Input
                        id={field.name}
                        placeholder="Ma Société SARL"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="logoUrl"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return undefined;
                      const r = z.url().safeParse(value);
                      return r.success ? undefined : 'URL invalide';
                    },
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <Label htmlFor={field.name}>
                        URL du logo{' '}
                        <span className="text-muted-foreground font-normal">
                          (optionnel)
                        </span>
                      </Label>
                      <Input
                        id={field.name}
                        type="url"
                        placeholder="https://monsite.com/logo.png"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={field.state.meta.errors.length > 0}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <Text size="xs" variant="destructive">
                          {field.state.meta.errors[0]}
                        </Text>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && (
                    <Spinner className="mr-2 size-3.5" />
                  )}
                  Enregistrer
                </Button>
              </div>
            </form>
          </section>

          {/* ── Numérotation des factures ── */}
          {profile && <InvoiceNumberingSection user={profile} />}

          {/* Account */}
          <section className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
            <Text size="sm" weight="semibold">
              Compte
            </Text>
            <div className="flex items-center justify-between">
              <div>
                <Text size="sm" weight="medium">
                  Se déconnecter
                </Text>
                <Caption>
                  Vous serez redirigé vers la page de connexion.
                </Caption>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOutIcon />
                Déconnexion
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
