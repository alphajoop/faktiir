import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from "./dto/forgot-password.dto";
import { GithubAuthGuard } from "./github-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Créer un nouveau compte" })
  @ApiResponse({
    status: 201,
    description: "Compte créé — cookie httpOnly défini",
  })
  @ApiResponse({ status: 409, description: "Email déjà enregistré" })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Post("login")
  @ApiOperation({ summary: "Connexion — définit un cookie httpOnly" })
  @ApiResponse({ status: 200, description: "Connexion réussie" })
  @ApiResponse({ status: 401, description: "Email ou mot de passe incorrect" })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post("logout")
  @ApiOperation({ summary: "Supprimer le cookie d'authentification" })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Obtenir le profil de l'utilisateur actuel" })
  getMe(@Request() req) {
    return this.authService.getMe(req.user.id);
  }

  @Get("github")
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: "Rediriger vers GitHub OAuth" })
  githubLogin() {
    // Passport redirige automatiquement vers GitHub
  }

  @Get("github/callback")
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: "Callback GitHub OAuth" })
  async githubCallback(@Request() req, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    try {
      await this.authService.githubLogin(req.user, res);
      // Redirect vers le dashboard avec le token dans un cookie (déjà posé par githubLogin)
      res.redirect(`${frontendUrl}/auth/github/success`);
    } catch {
      res.redirect(`${frontendUrl}/login?error=github`);
    }
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Demander un OTP de réinitialisation par email" })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post("verify-otp")
  @ApiOperation({ summary: "Vérifier le code OTP" })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post("reset-password")
  @ApiOperation({
    summary:
      "Réinitialiser le mot de passe - définit un nouveau cookie httpOnly",
  })
  resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetPassword(dto, res);
  }
}
