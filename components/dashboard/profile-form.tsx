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
import {
  updateUserProfile,
  updateCompanyLogo,
  type UpdateProfileRequest,
  type User,
} from '@/lib/api/users';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      address: user.address || '',
      phone: user.phone || '',
      defaultCurrency: 'CFA',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux', {
          description: 'La taille maximale est de 2MB',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Type de fichier invalide', {
          description: 'Veuillez sélectionner une image',
        });
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    try {
      setUploadingLogo(true);
      await updateCompanyLogo(session, logoFile);

      toast.success('Logo mis à jour', {
        description: 'Votre logo a été mis à jour avec succès',
      });

      setLogoFile(null);
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error('Erreur', {
        description:
          error instanceof Error
            ? error.message
            : 'Une erreur est survenue lors de la mise à jour du logo',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true);

      const profileData: UpdateProfileRequest = {
        name: data.name,
        address: data.address || null,
        phone: data.phone || null,
        defaultCurrency: data.defaultCurrency,
        companyLogo: user.companyLogo,
      };

      await updateUserProfile(session, profileData);

      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          address: data.address || '',
          phone: data.phone || '',
        },
      });

      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été mises à jour avec succès',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Erreur', {
        description:
          error instanceof Error
            ? error.message
            : 'Une erreur est survenue lors de la mise à jour',
      });
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById('logo-upload')?.click()
                  }
                  disabled={uploadingLogo}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choisir un logo
                </Button>
                {logoFile && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUploadLogo}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Enregistrer le logo
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
}
