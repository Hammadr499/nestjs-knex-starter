import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string;

  @Exclude()
  @ApiHideProperty()
  phone: string;

  @Exclude()
  @ApiHideProperty()
  password: string;

  @Exclude()
  @ApiHideProperty()
  gender: string;

  @Exclude()
  @ApiHideProperty()
  image_url: string;

  @Exclude()
  @ApiHideProperty()
  email_confirmation_code: string;

  @Exclude()
  @ApiHideProperty()
  email_confirmation_token: string;

  @Exclude()
  @ApiHideProperty()
  forgot_confirmation_token: string;

  @Exclude()
  @ApiHideProperty()
  forgot_confirmation_code: string;

  @Exclude()
  @ApiHideProperty()
  email_verification_count: number;

  @Exclude()
  @ApiHideProperty()
  recover_password_count: number;

  @Exclude()
  @ApiHideProperty()
  is_email_verified: boolean;

  @Exclude()
  @ApiHideProperty()
  is_phone_verified: boolean;

  @Exclude()
  @ApiHideProperty()
  is_blocked: boolean;

  @Exclude()
  @ApiHideProperty()
  deleted_at: Date;
}
