export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string | null;
  logoUrl?: string | null;
  githubId?: string | null;
  invoicePrefix: string;
  invoiceNextNumber: number;
  invoicePadding: number;
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

export interface UpdateInvoiceNumberingBody {
  invoicePrefix?: string;
  invoiceNextNumber?: number;
  invoicePadding?: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface InvoicesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceStatus;
  clientId?: string;
  sortBy?:
    | 'number'
    | 'issueDate'
    | 'dueDate'
    | 'total'
    | 'status'
    | 'createdAt';
  order?: 'asc' | 'desc';
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.faktiir.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fired when the server returns 401 — auth-context listens to this
export const SESSION_EXPIRED_EVENT = 'faktiir:session-expired';

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

// All requests use credentials: 'include' so the httpOnly cookie is sent automatically
async function request<T>(
  path: string,
  options: RequestInit = {},
  params?: Record<string, unknown>,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const url = buildUrl(path, params);

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, 'Serveur inaccessible. Vérifiez votre connexion.');
  }

  // Session expirée (uniquement pour les routes protégées, pas pour login)
  if (
    res.status === 401 &&
    path !== '/auth/me' &&
    !path.includes('/auth/login') &&
    !path.includes('/auth/github')
  ) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
    throw new ApiError(401, 'Session expirée. Veuillez vous reconnecter.');
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
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
  me: (token: string) => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return request<User>('/auth/me', { headers });
  },
  meWithCookie: () => request<User>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
  forgotPassword: (body: { email: string }) =>
    request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  verifyOtp: (body: { email: string; otp: string }) =>
    request<void>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  resetPassword: (body: { email: string; otp: string; newPassword: string }) =>
    request<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const clients = {
  list: (query?: ClientsQuery) =>
    request<PaginatedResponse<Client>>(
      '/clients',
      {},
      query as Record<string, unknown>,
    ),
  get: (id: string) => request<Client>(`/clients/${id}`),
  create: (body: {
    name: string;
    email?: string;
    address?: string;
    phone?: string;
  }) =>
    request<Client>('/clients', { method: 'POST', body: JSON.stringify(body) }),
  update: (
    id: string,
    body: { name?: string; email?: string; address?: string; phone?: string },
  ) =>
    request<Client>(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  remove: (id: string) => request<void>(`/clients/${id}`, { method: 'DELETE' }),
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
  list: (query?: InvoicesQuery) =>
    request<PaginatedResponse<Invoice>>(
      '/invoices',
      {},
      query as Record<string, unknown>,
    ),
  get: (id: string) => request<Invoice>(`/invoices/${id}`),
  create: (body: CreateInvoiceBody) =>
    request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (
    id: string,
    body: Partial<CreateInvoiceBody & { status: InvoiceStatus }>,
  ) =>
    request<Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    request<void>(`/invoices/${id}`, { method: 'DELETE' }),
  pdfUrl: (id: string) => `${BASE_URL}/invoices/${id}/pdf`,
};

export const users = {
  profile: () => request<User>('/users/profile'),
  update: (body: { name?: string; companyName?: string; logoUrl?: string }) =>
    request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  updateInvoiceNumbering: (body: UpdateInvoiceNumberingBody) =>
    request<User>('/users/invoice-numbering', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};
