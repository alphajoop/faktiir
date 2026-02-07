import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Tableau de bord - Faktiir',
  description:
    'Accédez à votre tableau de bord Faktiir pour gérer vos factures, suivre vos paiements et analyser votre activité.',
  noIndex: true, // Page privée du dashboard
});
