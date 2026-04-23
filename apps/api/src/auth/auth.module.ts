import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../mail/mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy } from "./github.strategy";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "faktiir-secret",
      signOptions: { expiresIn: "7d" },
    }),
    MailModule,
  ],
  providers: [AuthService, JwtStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
