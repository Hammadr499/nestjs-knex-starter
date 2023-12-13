import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { Knex } from 'knex';
import BaseRepo from '../common/baseRepo';
import { CONNECTION } from '../common/constants';
import { DB_TABLES } from '../db/models';
@Injectable()
export class AuthGuard extends BaseRepo implements CanActivate {
  constructor(
    @Inject(CONNECTION) db: Knex,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(db, DB_TABLES['USERS']);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('AUTH_SECRET'),
      });

      const user = await this.findById(decoded.id);
      if (!user) throw new UnauthorizedException();

      request['user'] = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
