import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "483920", description: "6-digit OTP" })
  @IsString()
  @Length(6, 6, { message: "Le code doit contenir 6 chiffres" })
  otp!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "483920" })
  @IsString()
  @Length(6, 6)
  otp!: string;

  @ApiProperty({ example: "newpassword123", minLength: 6 })
  @IsString()
  @MinLength(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  })
  newPassword!: string;
}
