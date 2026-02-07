import React from 'react';

/**
 * Helper pour injecter les schemas dans une page
 */
export function renderSchema(schema: object): string {
  return JSON.stringify(schema);
}

/**
 * Composant React pour les schemas (optionnel)
 */
export function JsonLd({ data }: { data: object }) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: renderSchema(data),
    },
  });
}

/**
 * Schéma Product pour Faktiir
 */
export function generateFaktiirProductSchema({
  name,
  description,
  price,
  currency = 'XOF',
}: {
  name: string;
  description: string;
  price: string;
  currency?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    category: 'Business Software',
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Faktiir',
        url: 'https://www.faktiir.com',
      },
    },
    brand: {
      '@type': 'Brand',
      name: 'Faktiir',
    },
  };
}

/**
 * Schéma Service pour les fonctionnalités de Faktiir
 */
export function generateFaktiirServiceSchema({
  name,
  description,
  provider = 'Faktiir',
}: {
  name: string;
  description: string;
  provider?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: 'https://www.faktiir.com',
    },
    serviceType: 'Financial Services',
  };
}
