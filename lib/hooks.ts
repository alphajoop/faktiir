import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type Client,
  type ClientsQuery,
  type CreateInvoiceBody,
  clients,
  type InvoiceStatus,
  type InvoicesQuery,
  invoices,
  type User,
  users,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export const qk = {
  clients: (q?: ClientsQuery) => ['clients', q ?? {}] as const,
  client: (id: string) => ['clients', id] as const,
  invoices: (q?: InvoicesQuery) => ['invoices', q ?? {}] as const,
  invoice: (id: string) => ['invoices', id] as const,
  profile: ['profile'] as const,
};

export function useClients(query?: ClientsQuery) {
  const { token } = useAuth();
  return useQuery({
    queryKey: qk.clients(query),
    queryFn: () => clients.list(token as string, query),
    enabled: !!token,
  });
}

export function useClient(id: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: qk.client(id),
    queryFn: () => clients.get(id, token as string),
    enabled: !!token && !!id,
  });
}

export function useCreateClient() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Client, 'id' | 'userId'>) =>
      clients.create(
        {
          ...body,
          email: body.email ?? undefined,
          address: body.address ?? undefined,
          phone: body.phone ?? undefined,
        },
        token as string,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Client> & { id: string }) =>
      clients.update(
        id,
        {
          ...body,
          email: body.email ?? undefined,
          address: body.address ?? undefined,
          phone: body.phone ?? undefined,
        },
        token as string,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clients.remove(id, token as string),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useInvoices(query?: InvoicesQuery) {
  const { token } = useAuth();
  return useQuery({
    queryKey: qk.invoices(query),
    queryFn: () => invoices.list(token as string, query),
    enabled: !!token,
  });
}

export function useInvoice(id: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: qk.invoice(id),
    queryFn: () => invoices.get(id, token as string),
    enabled: !!token && !!id,
  });
}

export function useCreateInvoice() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInvoiceBody) =>
      invoices.create(body, token as string),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpdateInvoice() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: Partial<CreateInvoiceBody & { status: InvoiceStatus }> & {
      id: string;
    }) => invoices.update(id, body, token as string),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: qk.invoice(id) });
    },
  });
}

export function useDeleteInvoice() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoices.remove(id, token as string),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useProfile() {
  const { token } = useAuth();
  return useQuery({
    queryKey: qk.profile,
    queryFn: () => users.profile(token as string),
    enabled: !!token,
  });
}

export function useUpdateProfile() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      body: Partial<Pick<User, 'name' | 'companyName' | 'logoUrl'>>,
    ) =>
      users.update(
        {
          ...body,
          companyName: body.companyName ?? undefined,
          logoUrl: body.logoUrl ?? undefined,
        },
        token as string,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.profile }),
  });
}
