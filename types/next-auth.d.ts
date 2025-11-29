import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      address: string;
      phone: string;
      createdAt: string;
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    address: string;
    phone: string;
    createdAt: string;
    token?: string;
  }
}
