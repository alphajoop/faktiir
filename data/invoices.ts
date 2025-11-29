import type { Invoice } from '@/types/invoice';

export const mockInvoices: Invoice[] = [
  {
    id: '6910e8fd33e33597f7c3dfcd',
    userId: '6910e8e233e33597f7c3dfcc',
    invoiceNo: 'FCT-2025-901851',
    clientName: 'Ahmadou Diop',
    clientEmail: 'ahmadou@mail.com',
    itemsJson: JSON.stringify([
      { description: 'Dev site', quantity: 1, price: 25000 },
    ]),
    subtotal: 25000,
    tax: 0,
    total: 25000,
    dueDate: '2025-11-30T00:00:00.000Z',
    pdfPath: 'invoices_pdfs/invoice-6910e8fd33e33597f7c3dfcd.pdf',
    createdAt: '2025-11-09T19:18:21.854Z',
  },
  {
    id: '6910e8fd33e33597f7c3dfce',
    userId: '6910e8e233e33597f7c3dfcc',
    invoiceNo: 'FCT-2025-901852',
    clientName: 'Marie Sall',
    clientEmail: 'marie@mail.com',
    itemsJson: JSON.stringify([
      { description: 'Design UI', quantity: 1, price: 15000 },
      { description: 'Maintenance', quantity: 2, price: 5000 },
    ]),
    subtotal: 25000,
    tax: 5000,
    total: 30000,
    dueDate: '2025-12-15T00:00:00.000Z',
    pdfPath: 'invoices_pdfs/invoice-6910e8fd33e33597f7c3dfce.pdf',
    createdAt: '2025-11-10T10:30:00.000Z',
  },
  {
    id: '6910e8fd33e33597f7c3dfcf',
    userId: '6910e8e233e33597f7c3dfcc',
    invoiceNo: 'FCT-2025-901853',
    clientName: 'Jean Paul',
    clientEmail: 'jp@mail.com',
    itemsJson: JSON.stringify([
      { description: 'Consulting', quantity: 40, price: 500 },
    ]),
    subtotal: 20000,
    tax: 4000,
    total: 24000,
    dueDate: '2025-12-01T00:00:00.000Z',
    pdfPath: 'invoices_pdfs/invoice-6910e8fd33e33597f7c3dfcf.pdf',
    createdAt: '2025-11-08T14:45:00.000Z',
  },
];
