import { Expose, Type } from 'class-transformer';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class EmailConfirmationEntity {
  @Expose()
  email_confirmation_token: string;
}

export class AuthSignUpEntity {
  @Expose()
  @Type(() => UserEntity)
  user: UserEntity;

  @Expose()
  email_confirmation_token: string;
}

export class AuthSignInEntity {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => UserEntity)
  user: UserEntity;
}
