import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(private prisma: PrismaService) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackUrl = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !clientSecret || !callbackUrl) {
      throw new Error("Missing required GitHub OAuth environment variables");
    }

    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackUrl,
      scope: ["user:email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      displayName: string;
      username: string;
      emails?: { value: string }[];
      photos?: { value: string }[];
    },
  ) {
    // GitHub peut ne pas exposer l'email si privé — on prend le premier disponible
    const email =
      profile.emails?.[0]?.value ??
      `${profile.username}@users.noreply.github.com`;

    const name = profile.displayName || profile.username;

    // Trouver ou créer l'utilisateur
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Créer le compte sans mot de passe (OAuth uniquement)
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: "", // Pas de mot de passe pour les comptes OAuth
          githubId: profile.id,
        },
      });
    } else if (!user.githubId) {
      // Lier le compte GitHub à un compte existant
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { githubId: profile.id },
      });
    }

    return user;
  }
}
