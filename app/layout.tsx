import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

/*
Police secondaire — Inter (Textes + “Faktiir”)

Inter donne :

un style moderne

un contraste clair

👉 À utiliser pour :

Textes

Textes secondaires

Textes de formulaire

Textes de bouton
*/
const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

/*
Police titre / branding — Manrope (Titres + “Faktiir”)

Manrope donne :

un style SaaS moderne

des arrondis élégants

un caractère premium

👉 À utiliser pour :

H1, H2

Headers des pages

Branding (logo texte)
*/
const manrope = Manrope({
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Faktiir - Facturation simple pour freelances',
  description:
    'Créez des factures professionnelles en quelques clics. Solution de facturation simple pour freelances et petits commerçants.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
