import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  auth,
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
  const { isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: qk.clients(query),
    queryFn: () => clients.list(query),
    enabled: !authLoading,
  });
}

export function useClient(id: string) {
  const { isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: qk.client(id),
    queryFn: () => clients.get(id),
    enabled: !authLoading && !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Client, 'id' | 'userId'>) =>
      clients.create({
        ...body,
        email: body.email ?? undefined,
        address: body.address ?? undefined,
        phone: body.phone ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<Client> & { id: string }) =>
      clients.update(id, {
        ...body,
        email: body.email ?? undefined,
        address: body.address ?? undefined,
        phone: body.phone ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clients.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useInvoices(query?: InvoicesQuery) {
  const { isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: qk.invoices(query),
    queryFn: () => invoices.list(query),
    enabled: !authLoading,
  });
}

export function useInvoice(id: string) {
  const { isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: qk.invoice(id),
    queryFn: () => invoices.get(id),
    enabled: !authLoading && !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInvoiceBody) => invoices.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: Partial<CreateInvoiceBody & { status: InvoiceStatus }> & {
      id: string;
    }) => invoices.update(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: qk.invoice(id) });
    },
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoices.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useProfile() {
  const { isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: qk.profile,
    queryFn: () => users.profile(),
    enabled: !authLoading,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      body: Partial<Pick<User, 'name' | 'companyName' | 'logoUrl'>>,
    ) =>
      users.update({
        ...body,
        companyName: body.companyName ?? undefined,
        logoUrl: body.logoUrl ?? undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.profile }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: { email: string }) => auth.forgotPassword(body),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (body: { email: string; otp: string }) => auth.verifyOtp(body),
  });
}

export function useResetPassword() {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: (body: { email: string; otp: string; newPassword: string }) =>
      auth.resetPassword(body),
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}
