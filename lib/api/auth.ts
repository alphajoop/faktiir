const API_URL = process.env.NEXT_PUBLIC_API_URL;

import type { Session } from 'next-auth';

export const getAuthToken = (session: Session | null): string | undefined => {
  return session?.accessToken;
};

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
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

export async function register(dto: RegisterDto): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Register failed: ${res.statusText}`);
  return res.json();
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
  return res.json();
}

export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface OtpResponse {
  message: string;
  error?: string;
  statusCode?: number;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    address: string | null;
    phone: string | null;
    createdAt: string;
  };
}

export async function sendOtp(dto: SendOtpDto): Promise<OtpResponse> {
  const res = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Send OTP failed: ${res.statusText}`);
  }
  return res.json();
}

export async function verifyOtp(dto: VerifyOtpDto): Promise<OtpResponse> {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Verify OTP failed: ${res.statusText}`,
    );
  }
  return res.json();
}

export async function forgotPassword(
  dto: ForgotPasswordDto,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to send reset password email');
  }
  return res.json();
}

export async function resetPassword(
  dto: ResetPasswordDto,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to reset password');
  }
  return res.json();
}
