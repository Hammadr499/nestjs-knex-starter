import * as dotenv from 'dotenv';
import type { Knex } from 'knex';
dotenv.config();

const {
  DB_CLIENT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE,
  DB_EXTENSION,
  MIGRATION_DIR,
  SEED_DIR,
} = process.env;

// Update with your config settings.

const config: Knex.Config = {
  client: DB_CLIENT,
  connection: {
    host: DB_HOST,
    port: +DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    charset: 'utf8',
    debug: false,
  },
  migrations: {
    directory: MIGRATION_DIR,
    extension: DB_EXTENSION,
  },
  seeds: {
    directory: SEED_DIR,
    extension: DB_EXTENSION,
  },
};

module.exports = config;
