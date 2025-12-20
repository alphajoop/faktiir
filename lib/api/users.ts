const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { Session } from 'next-auth';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string | null;
  emailVerified: boolean;
  phone: string | null;
  companyLogo: string | null;
  defaultCurrency: string;
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

export type UpdateProfileRequest = Pick<
  User,
  'name' | 'address' | 'phone' | 'defaultCurrency' | 'companyLogo'
>;

export async function updateUserProfile(
  session: Session | null,
  profileData: UpdateProfileRequest,
): Promise<User> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const res = await fetch(`${API_URL}/users/profile`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la mise à jour du profil: ${res.statusText}`,
    );
  }

  return res.json();
}

export async function updateCompanyLogo(
  session: Session | null,
  logoFile: File,
): Promise<{ message: string }> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const formData = new FormData();
  formData.append('file', logoFile);

  const res = await fetch(`${API_URL}/users/profile/logo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Échec de la mise à jour du logo: ${res.statusText}`,
    );
  }

  return res.json();
}
