import {
  BarChart2,
  //CreditCard,
  File,
  Plus,
  //Settings,
  Sparkles,
  User,
} from 'lucide-react';
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
    title: 'Profil',
    url: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Abonnement',
    url: '/dashboard/subscription',
    icon: Sparkles,
  },
  /*{
    title: 'Paramètres',
    url: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Facturation',
    url: '/dashboard/billing',
    icon: CreditCard,
  },*/
];

export const routeNameMapping: Record<string, string> = {
  '': 'Tableau de bord',
  dashboard: 'Tableau de bord',
  invoices: 'Factures',
  new: 'Nouvelle facture',
  profile: 'Profil',
  subscription: 'Abonnement',
  //settings: 'Paramètres',
  //billing: 'Facturation',
};
