export interface Invoice {
  id: string;
  userId: string;
  invoiceNo: string;
  clientName: string;
  clientEmail: string;
  itemsJson: string;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  pdfPath: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
