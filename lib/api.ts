export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
  userId: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  total: number;
  tax: number;
  notes?: string | null;
  userId: string;
  clientId: string;
  client: Client;
  items: InvoiceItem[];
  user?: User;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// ─── API Client ───────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.faktiir.com';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const TOKEN_KEY = 'faktiir_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const auth = {
  register: (body: {
    email: string;
    password: string;
    name: string;
    companyName?: string;
  }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  me: (token: string) => request<User>('/auth/me', {}, token),
};

export const clients = {
  list: (token: string) => request<Client[]>('/clients', {}, token),
  get: (id: string, token: string) =>
    request<Client>(`/clients/${id}`, {}, token),
  create: (
    body: { name: string; email?: string; address?: string; phone?: string },
    token: string,
  ) =>
    request<Client>(
      '/clients',
      { method: 'POST', body: JSON.stringify(body) },
      token,
    ),
  update: (
    id: string,
    body: { name?: string; email?: string; address?: string; phone?: string },
    token: string,
  ) =>
    request<Client>(
      `/clients/${id}`,
      { method: 'PATCH', body: JSON.stringify(body) },
      token,
    ),
  remove: (id: string, token: string) =>
    request<void>(`/clients/${id}`, { method: 'DELETE' }, token),
};

export interface CreateInvoiceBody {
  clientId: string;
  issueDate: string;
  dueDate: string;
  tax: number;
  notes?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

export const invoices = {
  list: (token: string) => request<Invoice[]>('/invoices', {}, token),
  get: (id: string, token: string) =>
    request<Invoice>(`/invoices/${id}`, {}, token),
  create: (body: CreateInvoiceBody, token: string) =>
    request<Invoice>(
      '/invoices',
      { method: 'POST', body: JSON.stringify(body) },
      token,
    ),
  update: (
    id: string,
    body: Partial<CreateInvoiceBody & { status: InvoiceStatus }>,
    token: string,
  ) =>
    request<Invoice>(
      `/invoices/${id}`,
      { method: 'PATCH', body: JSON.stringify(body) },
      token,
    ),
  remove: (id: string, token: string) =>
    request<void>(`/invoices/${id}`, { method: 'DELETE' }, token),
  pdfUrl: (id: string) => `${BASE_URL}/invoices/${id}/pdf`,
};

export const users = {
  profile: (token: string) => request<User>('/users/profile', {}, token),
  update: (
    body: { name?: string; companyName?: string; logoUrl?: string },
    token: string,
  ) =>
    request<User>(
      '/users/profile',
      { method: 'PATCH', body: JSON.stringify(body) },
      token,
    ),
};

export { ApiError };
