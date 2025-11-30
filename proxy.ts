import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Chemins publics accessibles sans authentification
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/_next',
  '/favicon.ico',
];

// Vérifie si le chemin est public
const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath));
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  // Si le chemin est public, on laisse passer
  if (isPublicPath(pathname)) {
    // Rediriger les utilisateurs déjà connectés qui essaient d'accéder à des pages d'authentification
    if (
      (pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/verify-otp')) &&
      session?.user
    ) {
      if (session.user.emailVerified === false) {
        const url = new URL('/verify-otp', req.url);
        const email = session.user.email || '';
        if (email) url.searchParams.set('email', email);
        return NextResponse.redirect(url);
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Vérification de l'authentification pour les routes protégées
  if (!session?.user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Vérification de la vérification d'email
  if (session.user.emailVerified === false) {
    const url = new URL('/verify-otp', req.url);
    const email = session.user.email || '';
    if (email) url.searchParams.set('email', email);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est connecté et vérifié, on laisse passer
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
