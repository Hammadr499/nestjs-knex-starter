import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import * as moment from 'moment';
import { UserRepo } from '../../repositories/user.repository';
import { makeRandomID } from '../../utils';
import {
  AuthSignInEntity,
  AuthSignUpEntity,
  EmailConfirmationEntity,
  ForgotConfirmationEntity,
} from '../auth/entities/auth.entity';
import { UserEntity } from '../user/entities/user.entity';
import {
  ForgotPasswordDto,
  LoginDto,
  SignUpDto,
  UpdatePasswordDto,
} from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(data: SignUpDto): Promise<AuthSignUpEntity> {
    const isValidEmail: boolean = await this.userRepo.exists({
      email: data.email,
    });

    if (isValidEmail) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash: string = bcrypt.hashSync(
      data.password,
      bcrypt.genSaltSync(12),
    );

    const user: UserEntity[] = await this.userRepo.create({
      email: data.email,
      password: passwordHash,
      first_name: data.firstName,
      last_name: data.lastName,
      email_confirmation_code: Math.floor(100000 + Math.random() * 900000),
      email_confirmation_token: makeRandomID(60),
    });

    // send code here

    return plainToInstance(AuthSignUpEntity, {
      user: user[0],
      email_confirmation_token: user[0].email_confirmation_token,
    });
  }

  async login({ email, password }: LoginDto): Promise<AuthSignInEntity> {
    const user: UserEntity = await this.userRepo.findOne({
      email: email,
      deleted_at: null,
    });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const passwordIsValid: boolean = bcrypt.compareSync(
      password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token: string = this.jwtService.sign(
      { id: user.id },
      { expiresIn: this.configService.get('AUTH_TOKEN_EXPIRY') },
    );

    return plainToInstance(AuthSignInEntity, {
      user,
      accessToken: token,
    });
  }

  async resendEmailVerification({ email }): Promise<EmailConfirmationEntity> {
    const user: UserEntity = await this.userRepo.findOne({
      email: email,
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const token: string = makeRandomID(60);
    await this.userRepo.update(user.id, {
      email_confirmation_code: Math.floor(100000 + Math.random() * 900000),
      email_confirmation_token: token,
      email_verification_count: 0,
    });

    //send code here

    return { email_confirmation_token: token };
  }

  async emailVerification({ token, code }): Promise<void> {
    const isValidToken: UserEntity = await this.userRepo.findOne({
      email_confirmation_token: token,
    });

    if (!isValidToken) {
      throw new NotFoundException('Token is not valid');
    }

    if (isValidToken.email_verification_count >= 3) {
      throw new BadRequestException('Token expires please regenerate it.');
    }

    const isValidCode: UserEntity = await this.userRepo.findOne({
      email_confirmation_token: token,
      email_confirmation_code: code,
    });

    if (!isValidCode) {
      const count = isValidToken.email_verification_count + 1;

      await this.userRepo.update(isValidToken.id, {
        email_verification_count: count,
        updated_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
      });
      throw new BadRequestException('Invalid code.');
    }

    const email_confirmation_code = Math.floor(100000 + Math.random() * 900000);

    await this.userRepo.update(isValidToken.id, {
      email_confirmation_token: makeRandomID(60),
      is_email_verified: true,
      email_confirmation_code,
    });

    return;
  }

  async forgotPassword({
    email,
  }: ForgotPasswordDto): Promise<ForgotConfirmationEntity> {
    const user: UserEntity = await this.userRepo.findOne({
      email: email,
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const token: string = makeRandomID(60);
    await this.userRepo.update(user.id, {
      forgot_confirmation_code: Math.floor(100000 + Math.random() * 900000),
      forgot_confirmation_token: token,
      recover_password_count: 0,
    });

    //send code here

    return { forgot_confirmation_token: token };
  }

  async updatePassword({
    password,
    token,
    code,
  }: UpdatePasswordDto): Promise<void> {
    const isValidToken: UserEntity = await this.userRepo.findOne({
      forgot_confirmation_token: token,
    });

    if (!isValidToken) {
      throw new NotFoundException('Invalid Token');
    }

    if (isValidToken.recover_password_count >= 3) {
      throw new BadRequestException('Token expires please regenerate it.');
    }

    const isValidCode: UserEntity = await this.userRepo.findOne({
      forgot_confirmation_token: token,
      forgot_confirmation_code: code,
    });

    if (!isValidCode) {
      const count = isValidToken.recover_password_count + 1;

      await this.userRepo.update(isValidToken.id, {
        recover_password_count: count,
        updated_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
      });
      throw new BadRequestException('Invalid code.');
    }

    const forgot_confirmation_token = makeRandomID(60);

    await this.userRepo.update(isValidToken.id, {
      forgot_confirmation_token: forgot_confirmation_token,
      forgot_confirmation_code: Math.floor(100000 + Math.random() * 900000),
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(12)),
    });
    return;
  }
}
