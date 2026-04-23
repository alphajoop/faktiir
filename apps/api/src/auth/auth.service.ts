import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import type { CookieOptions, Response } from "express";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "./dto/forgot-password.dto";

export const COOKIE_NAME = "faktiir_token";

const isProd = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: "/",
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists)
      throw new ConflictException(
        "Un compte existe déjà avec cette adresse email",
      );

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        companyName: dto.companyName,
      },
    });

    const { password: _, ...result } = user;
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    // Clean old cookies before setting new one
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return { user: result, access_token: token };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException("Email ou mot de passe incorrect");

    // Les comptes GitHub n'ont pas de mot de passe
    if (!user.password) {
      throw new UnauthorizedException(
        "Ce compte utilise GitHub pour se connecter. Utilisez le bouton « Continuer avec GitHub ».",
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException("Email ou mot de passe incorrect");

    const { password: _, ...result } = user;
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    // Clean old cookies before setting new one
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return { user: result, access_token: token };
  }

  async logout(res: Response) {
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    });
    return { message: "Logged out" };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Appelé après validation GitHub OAuth — pose le cookie JWT et retourne le user
   */
  async githubLogin(user: { id: string; email: string }, res: Response) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!fullUser) throw new UnauthorizedException();
    const { password: _, ...result } = fullUser;
    return { user: result, access_token: token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Always return success to avoid email enumeration
    if (!user) {
      return { message: "Si ce compte existe, un code a été envoyé." };
    }

    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: { token: hashedOtp, userId: user.id, expiresAt },
    });

    await this.mailService.sendPasswordResetOtp(user.email, otp, user.name);

    return { message: "Si ce compte existe, un code a été envoyé." };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException("Code invalide ou expiré");

    const tokenRecord = await this.findValidToken(user.id);
    if (!tokenRecord) throw new BadRequestException("Code invalide ou expiré");

    const valid = await bcrypt.compare(dto.otp, tokenRecord.token);
    if (!valid) throw new BadRequestException("Code invalide ou expiré");

    return { valid: true };
  }

  async resetPassword(dto: ResetPasswordDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException("Code invalide ou expiré");

    const tokenRecord = await this.findValidToken(user.id);
    if (!tokenRecord) throw new BadRequestException("Code invalide ou expiré");

    const valid = await bcrypt.compare(dto.otp, tokenRecord.token);
    if (!valid) throw new BadRequestException("Code invalide ou expiré");

    await this.prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    const { password: _, ...result } = updated;
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    // Log in automatically after reset
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return { user: result, access_token: token };
  }

  private async findValidToken(userId: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { userId, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }
}
