import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class LoginDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class UpdatePasswordDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  code: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class VerifyEmailDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  token: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  code: string;
}
