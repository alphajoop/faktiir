const API_URL = process.env.NEXT_PUBLIC_API_URL;

import type {
  Invoice,
  PaginatedResponse,
  GetInvoicesParams,
} from '@/types/invoice';

import { Session } from 'next-auth';

export const getAuthToken = (session: Session | null): string | undefined => {
  return session?.accessToken;
};

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    address: string;
    phone: string;
    createdAt: string;
  };
}

export async function register(dto: RegisterDto): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Register failed: ${res.statusText}`);
  return res.json();
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
  return res.json();
}

export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface OtpResponse {
  message: string;
  error?: string;
  statusCode?: number;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    address: string | null;
    phone: string | null;
    createdAt: string;
  };
}

export async function sendOtp(dto: SendOtpDto): Promise<OtpResponse> {
  const res = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Send OTP failed: ${res.statusText}`);
  }
  return res.json();
}

export async function verifyOtp(dto: VerifyOtpDto): Promise<OtpResponse> {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Verify OTP failed: ${res.statusText}`,
    );
  }
  return res.json();
}

export async function getInvoices(
  session: Session | null,
  params: GetInvoicesParams = {},
): Promise<PaginatedResponse<Invoice>> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  // Construction des paramètres de requête
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const url = `${API_URL}/invoices${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la récupération des factures: ${res.statusText}`,
    );
  }

  return res.json();
}

export async function getInvoiceById(session: Session | null, id: string) {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const res = await fetch(`${API_URL}/invoices/${id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la récupération de la facture: ${res.statusText}`,
    );
  }

  return res.json();
}

export async function getInvoicePdf(
  session: Session | null,
  id: string,
): Promise<Blob> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const res = await fetch(`${API_URL}/invoices/${id}/pdf`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log('id', id);
    console.error('PDF download failed:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorData,
    });
    throw new Error(
      errorData.message ||
        `Échec du téléchargement du PDF de la facture: ${res.statusText}`,
    );
  }

  return res.blob();
}

export async function deleteInvoice(session: Session | null, id: string) {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const res = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la suppression de la facture: ${res.statusText}`,
    );
  }

  return res.json();
}

export async function forgotPassword(
  dto: ForgotPasswordDto,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to send reset password email');
  }
  return res.json();
}

export async function resetPassword(
  dto: ResetPasswordDto,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to reset password');
  }
  return res.json();
}

export async function getCurrentUser(session: Session | null) {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la récupération du profil: ${res.statusText}`,
    );
  }
  return res.json();
}

export * from './api/subscriptions';
