import { ApiError } from '@/lib/api';

/**
 * Returns a human-readable error message and an icon hint from an unknown error.
 */
export function classifyError(error: unknown): {
  title: string;
  description: string;
  icon: 'offline' | 'warning';
} {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return {
        title: 'Serveur inaccessible',
        description:
          'Impossible de joindre le serveur. Vérifiez votre connexion internet et réessayez.',
        icon: 'offline',
      };
    }
    if (error.status === 401) {
      return {
        title: 'Session expirée',
        description: 'Votre session a expiré. Reconnectez-vous.',
        icon: 'warning',
      };
    }
    if (error.status >= 500) {
      return {
        title: 'Erreur serveur',
        description:
          'Le serveur a rencontré un problème. Réessayez dans quelques instants.',
        icon: 'warning',
      };
    }
    return {
      title: 'Une erreur est survenue',
      description: error.message || 'Réessayez dans quelques instants.',
      icon: 'warning',
    };
  }

  return {
    title: 'Une erreur est survenue',
    description: 'Réessayez dans quelques instants.',
    icon: 'warning',
  };
}
