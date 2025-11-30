const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { Session } from 'next-auth';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getCurrentUser(session: Session | null): Promise<User> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la récupération de l'utilisateur: ${res.statusText}`,
    );
  }

  return res.json();
}
