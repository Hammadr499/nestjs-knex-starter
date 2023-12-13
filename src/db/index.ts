import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';
import { CONNECTION } from '../common/constants';
const providers = {
  provide: CONNECTION,
  useFactory: (configService: ConfigService) => {
    const knex = Knex({
      client: configService.get('DB_CLIENT'),
      connection: {
        host: configService.get('DB_HOST'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        port: +configService.get('DB_PORT'),
        database: configService.get('DB_DATABASE'),
      },
    });
    return knex;
  },
  inject: [ConfigService],
};
@Global()
@Module({
  providers: [providers],
  exports: [providers],
})
export class DatabaseModule {}
