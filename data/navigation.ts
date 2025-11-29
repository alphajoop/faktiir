import { BarChart2, File, Plus, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const getMenuItems = (): MenuItem[] => [
  {
    title: 'Tableau de bord',
    url: '/dashboard',
    icon: BarChart2,
  },
  {
    title: 'Nouvelle facture',
    url: '/dashboard/invoices/new',
    icon: Plus,
  },
  {
    title: 'Factures',
    url: '/dashboard/invoices',
    icon: File,
  },
  {
    title: 'Paramètres',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

export const routeNameMapping: Record<string, string> = {
  '': 'Tableau de bord',
  dashboard: 'Tableau de bord',
  invoices: 'Factures',
  'invoices/new': 'Nouvelle facture',
  'invoices/:id': 'Facture',
  'invoices/:id/edit': 'Modifier facture',
  'invoices/:id/delete': 'Supprimer facture',
  settings: 'Paramètres',
};
