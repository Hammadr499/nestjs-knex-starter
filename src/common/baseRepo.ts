import { Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import * as moment from 'moment';
import { IWhere } from './interface';

@Injectable()
export default class BaseRepo {
  constructor(
    protected readonly db: Knex,
    private readonly table: string,
  ) {}

  create(data: any): Knex.QueryBuilder {
    return this.db(this.table)
      .insert({
        ...data,
        created_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DDTHH:mm:ss'),
      })
      .returning('*');
  }

  bulkCreate(data: any): Knex.QueryBuilder {
    return this.db(this.table)
      .insert([...data])
      .returning('*');
  }

  findAll(
    where: IWhere = {},
    orWhere: IWhere = {},
    whereNot: IWhere = {},
  ): Knex.QueryBuilder {
    const query = this.db.select('*').from(this.table);
    for (const key in where) {
      query.where(key, where[key]);
    }

    for (const key in orWhere) {
      query.orWhere(key, orWhere[key]);
    }

    for (const key in whereNot) {
      query.whereNot(key, whereNot[key]);
    }

    return query;
  }

  findById(id: number | string): Knex.QueryBuilder {
    return this.db.select('*').from(this.table).where({ id }).first();
  }

  findOne(
    where: IWhere = {},
    orWhere: IWhere = {},
    whereNot: IWhere = {},
  ): Knex.QueryBuilder {
    const query = this.db.select('*').from(this.table);

    for (const key in where) {
      query.where(key, where[key]);
    }

    for (const key in orWhere) {
      query.orWhere(key, orWhere[key]);
    }

    for (const key in whereNot) {
      query.whereNot(key, whereNot[key]);
    }

    return query.first();
  }

  update(id: number | string, data: any): Knex.QueryBuilder {
    return this.db(this.table).where('id', id).update(data);
  }

  softDelete(id: number | string): Knex.QueryBuilder {
    return this.db(this.table)
      .where('id', id)
      .update({ deleted_at: moment().format('YYYY-MM-DDTHH:mm:ss') });
  }

  delete(where: IWhere = {}): Knex.QueryBuilder {
    const query = this.db(this.table);

    for (const key in where) {
      query.where(key, where[key]);
    }

    return query.del();
  }
  async exists(
    where: IWhere = {},
    orWhere: IWhere = {},
    id: string | number = null,
  ): Promise<boolean> {
    try {
      let query = this.db.select('*').from(this.table);

      if (id) {
        query = await query.where({ id }).first();
        return query ? true : false;
      }

      for (const key in where) {
        query.where(key, where[key]);
      }

      for (const key in orWhere) {
        query.orWhere(key, orWhere[key]);
      }
      return (await query).length ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
