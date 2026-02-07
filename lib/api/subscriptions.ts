const API_URL = process.env.NEXT_PUBLIC_API_URL;

import type { Session } from 'next-auth';

export interface CheckoutSubscriptionDto {
  planId: string;
}

export interface CheckoutSubscriptionResponse {
  paymentUrl?: string;
  message?: string;
}

export async function checkoutSubscription(
  session: Session | null,
  dto: CheckoutSubscriptionDto,
): Promise<CheckoutSubscriptionResponse> {
  if (!session?.accessToken) {
    throw new Error(
      "Aucun jeton d'authentification disponible. Veuillez vous reconnecter.",
    );
  }

  const res = await fetch(`${API_URL}/subscriptions/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Échec de la création du paiement: ${res.statusText}`,
    );
  }

  return res.json();
}
