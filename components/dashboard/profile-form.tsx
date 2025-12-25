'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useUpdateProfile, useUpdateLogo } from '@/hooks/use-user';
import type { User } from '@/lib/api/users';
import Image from 'next/image';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  address: z.string().optional(),
  phone: z.string().optional(),
  defaultCurrency: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();
  const updateLogoMutation = useUpdateLogo();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      address: user.address || '',
      phone: user.phone || '',
      defaultCurrency: user.defaultCurrency || 'CFA',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      form.setError('root', {
        message: 'Le fichier est trop volumineux (max 2MB)',
      });
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      form.setError('root', {
        message: 'Veuillez sélectionner une image',
      });
      return;
    }

    setLogoFile(file);

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    await updateLogoMutation.mutateAsync(logoFile);
    setLogoFile(null);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfileMutation.mutateAsync({
      name: data.name,
      address: data.address || null,
      phone: data.phone || null,
      defaultCurrency: data.defaultCurrency,
      companyLogo: user.companyLogo,
    });
  };

  const isLoading = updateProfileMutation.isPending;
  const isUploadingLogo = updateLogoMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Logo Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Logo de l&apos;entreprise</h3>
            <p className="text-muted-foreground text-sm">
              Ce logo apparaîtra sur vos factures
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Avatar className="relative h-24 w-24 rounded-lg">
              {logoPreview || user.companyLogo ? (
                <Image
                  src={logoPreview || user.companyLogo || ''}
                  alt="Logo"
                  className="object-contain"
                  fill
                  priority
                />
              ) : (
                <AvatarFallback className="rounded-lg text-2xl">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById('logo-upload')?.click()
                  }
                  disabled={isUploadingLogo}
                  className="w-full sm:w-auto"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choisir un logo
                </Button>
                {logoFile && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUploadLogo}
                    disabled={isUploadingLogo}
                    className="w-full sm:w-auto"
                  >
                    {isUploadingLogo && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Enregistrer
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                PNG, JPG jusqu&apos;à 2MB
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            <p className="text-muted-foreground text-sm">
              Ces informations apparaîtront sur vos factures
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom / Nom de l&apos;entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={user.email} disabled />
              </FormControl>
              <FormDescription>
                L&apos;email ne peut pas être modifié
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+221 XX XXX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise par défaut</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormDescription>
                    La devise utilisée pour vos factures
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre adresse complète" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cette adresse apparaîtra sur vos factures
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
}
