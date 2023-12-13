import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema.createTable('users', function (t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('email').notNullable();
    t.string('password').notNullable();
    t.string('phone').nullable();
    t.string('gender').nullable();

    t.string('image_url').nullable();
    t.boolean('is_blocked').defaultTo(false);

    t.string('email_confirmation_code', 10).nullable();
    t.string('email_confirmation_token', 200).nullable();
    t.string('forgot_confirmation_token', 200).nullable();
    t.string('forgot_confirmation_code', 10).nullable();

    t.boolean('is_email_verified').defaultTo(false);
    t.boolean('is_phone_verified').defaultTo(false);

    t.integer('email_verification_count').defaultTo(0);
    t.integer('recover_password_count').defaultTo(0);

    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').nullable();
    t.dateTime('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
