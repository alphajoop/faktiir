'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  getCurrentUser,
  updateUserProfile,
  updateCompanyLogo,
  type User,
  type UpdateProfileRequest,
} from '@/lib/api/users';

export function useUser() {
  const { data: session } = useSession();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ['user', session?.user?.id],
    queryFn: () => getCurrentUser(session),
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    user,
    isLoading,
    error,
    refetch,
  };
}

export function useUpdateProfile() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return updateUserProfile(session, profileData);
    },
    onSuccess: async (updatedUser) => {
      // Mettre à jour le cache React Query
      queryClient.setQueryData(['user', session?.user?.id], updatedUser);

      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été mises à jour avec succès',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description:
          error.message || 'Une erreur est survenue lors de la mise à jour',
      });
    },
  });
}

export function useUpdateLogo() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logoFile: File) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return updateCompanyLogo(session, logoFile);
    },
    onSuccess: () => {
      // Invalider le cache pour recharger les données utilisateur
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id] });

      toast.success('Logo mis à jour', {
        description: 'Votre logo a été mis à jour avec succès',
      });
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description:
          error.message ||
          'Une erreur est survenue lors de la mise à jour du logo',
      });
    },
  });
}
