import NextAuth, { NextAuthConfig, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login, verifyOtp } from './api';

interface JWTToken {
  accessToken?: string;
  user?: User;
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const data = await login({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (data?.user && data?.token) {
          return { ...data.user, token: data.token };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: 'otp',
      name: 'OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const data = await verifyOtp({
          email: credentials.email as string,
          otp: credentials.otp as string,
        });

        if (data?.user && data?.token) {
          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            emailVerified: data.user.emailVerified,
            address: data.user.address ?? '',
            phone: data.user.phone ?? '',
            createdAt: data.user.createdAt,
            token: data.token,
          };
          return user;
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as User;
        return {
          ...token,
          accessToken: authUser.token,
          user: {
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            address: authUser.address,
            phone: authUser.phone,
            createdAt: authUser.createdAt,
          },
        };
      }
      return token;
    },
    async session({ session, token }) {
      const jwtToken = token as JWTToken;
      if (jwtToken.accessToken && jwtToken.user) {
        return {
          ...session,
          accessToken: jwtToken.accessToken,
          user: jwtToken.user,
        };
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
