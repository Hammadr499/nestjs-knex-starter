import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParamAndBody } from '../../decorators/index';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  SignUpDto,
  UpdatePasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import {
  AuthSignInEntity,
  AuthSignUpEntity,
  EmailConfirmationEntity,
  ForgotConfirmationEntity,
} from './entities/auth.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User Sign Up' })
  @HttpCode(200)
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthSignUpEntity> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User Login' })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<AuthSignInEntity> {
    return await this.authService.login(loginDto);
  }

  @Post('/resend-verification')
  @ApiOperation({ summary: 'Get Verification Code' })
  @HttpCode(200)
  async resendEmailVerification(
    @Body() emailDto: ForgotPasswordDto,
  ): Promise<EmailConfirmationEntity> {
    return await this.authService.resendEmailVerification(emailDto);
  }

  @Post('/email-verification/:token')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiParam({ name: 'token', type: 'string' })
  @ApiBody({
    type: 'string',
    schema: {
      type: 'object',
      nullable: false,
      properties: { code: { type: 'string' } },
    },
  })
  @HttpCode(204)
  async emailVerification(
    @ParamAndBody() verifyEmailDto: VerifyEmailDto,
  ): Promise<void> {
    return await this.authService.emailVerification(verifyEmailDto);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'User Forgot Password' })
  @HttpCode(200)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotConfirmationEntity> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/recover-password/:token')
  @ApiOperation({ summary: 'User Recover Password' })
  @ApiParam({ name: 'token', type: 'string' })
  @ApiBody({
    type: 'string',
    schema: {
      type: 'object',
      nullable: false,
      properties: { code: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @HttpCode(204)
  async updatePassword(
    @ParamAndBody() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    return await this.authService.updatePassword(updatePasswordDto);
  }
}
