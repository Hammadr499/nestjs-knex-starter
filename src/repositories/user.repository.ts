import { Inject, Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import BaseRepo from '../common/baseRepo';
import { CONNECTION } from '../common/constants';
import { DB_TABLES } from '../db/models';

@Injectable()
export class UserRepo extends BaseRepo {
  constructor(@Inject(CONNECTION) db: Knex) {
    super(db, DB_TABLES['USERS']);
  }
}
