import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Profil - Faktiir',
  description:
    "Gérez votre profil Faktiir : informations personnelles, logo d'entreprise et préférences de facturation.",
  noIndex: true, // Page privée du dashboard
});
