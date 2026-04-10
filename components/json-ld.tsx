export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // Organization
      {
        '@type': 'Organization',
        '@id': 'https://www.faktiir.com/#organization',
        name: 'FAKTIIR',
        url: 'https://www.faktiir.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.faktiir.com/opengraph-image.jpg',
          width: 1200,
          height: 630,
        },
        sameAs: ['https://github.com/faktiir'],
      },
      // WebSite with SearchAction
      {
        '@type': 'WebSite',
        '@id': 'https://www.faktiir.com/#website',
        url: 'https://www.faktiir.com',
        name: 'FAKTIIR',
        description:
          'Logiciel de facturation open source pour freelances, auto-entrepreneurs et PME.',
        publisher: { '@id': 'https://www.faktiir.com/#organization' },
        inLanguage: 'fr-FR',
      },
      // SoftwareApplication
      {
        '@type': 'SoftwareApplication',
        name: 'FAKTIIR',
        operatingSystem: 'Web',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        description:
          'Créez, envoyez et gérez vos factures professionnelles en ligne. Gratuit et open source.',
        url: 'https://www.faktiir.com',
        image: 'https://www.faktiir.com/opengraph-image.jpg',
        author: { '@id': 'https://www.faktiir.com/#organization' },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe and static
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
