import type { Metadata } from 'next';

// Configuration SEO de base
export const siteConfig = {
  name: 'Faktiir',
  description:
    'Solution de facturation simple pour freelances et petits commerçants',
  url: 'https://www.faktiir.com',
  ogImage: 'https://www.faktiir.com/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/khoss_dev',
    github: 'https://github.com/alphajoop',
  },
};

// Métadonnées par défaut pour toutes les pages
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'facturation',
    'freelance',
    'petits commerçants',
    'facture',
    'FCFA',
    'Afrique',
    'gestion',
    'facturier',
  ],
  authors: [{ name: 'Faktiir Team' }],
  creator: 'Faktiir',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@faktiir',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Fonction helper pour créer des métadonnées personnalisées
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  ...props
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} & Metadata): Metadata {
  return {
    ...defaultMetadata,
    ...props,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// Données structurées JSON-LD pour l'organisation
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  sameAs: [siteConfig.links.twitter, siteConfig.links.github],
};

// Données structurées JSON-LD pour le site web
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};
