import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/json-ld';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = 'https://www.faktiir.com';
const DESCRIPTION =
  'Faktiir est un logiciel de facturation open source simple et moderne pour freelances, auto-entrepreneurs et PME. Créez, envoyez et gérez vos factures en quelques clics.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FAKTIIR — Logiciel de facturation open source',
    template: '%s | FAKTIIR',
  },
  description: DESCRIPTION,
  keywords: [
    'facturation',
    'facture',
    'logiciel facturation',
    'facturation en ligne',
    'factures freelance',
    'gestion factures',
    'open source',
    'PME',
    'auto-entrepreneur',
    'devis',
    'clients',
    'invoice',
  ],
  authors: [{ name: 'FAKTIIR', url: SITE_URL }],
  creator: 'FAKTIIR',
  publisher: 'FAKTIIR',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'FAKTIIR',
    title: 'FAKTIIR — Logiciel de facturation open source',
    description: DESCRIPTION,
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FAKTIIR — Logiciel de facturation simple et moderne',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAKTIIR — Logiciel de facturation open source',
    description: DESCRIPTION,
    images: ['/opengraph-image.jpg'],
    creator: '@faktiir',
    site: '@faktiir',
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      /*{ url: '/icon.svg', type: 'image/svg+xml' }, */
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        'h-full antialiased',
        inter.variable,
        geistSans.variable,
        geistMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd />
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
