const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { Session } from 'next-auth';

import type {
  Invoice,
  PaginatedResponse,
  GetInvoicesParams,
  CreateInvoice,
} from '@/types/invoice';

export async function createInvoice(
  session: Session | null,
  data: CreateInvoice,
): Promise<Invoice> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  try {
    const res = await fetch(`${API_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Échec de la création de la facture: ${res.statusText}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
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
