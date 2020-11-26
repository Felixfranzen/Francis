import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('feature', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name').notNullable()
    table.string('key').notNullable().unique()
  })

  await knex.schema.createTable('flag', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table
      .uuid('feature_id')
      .notNullable()
      .references('id')
      .inTable('feature')
      .onDelete('CASCADE')
    table.string('name').notNullable()
    table.boolean('enabled').notNullable().defaultTo(false)
    table.jsonb('predicates').notNullable().defaultTo([])
  })

  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.enum('role', ['user', 'admin']).notNullable()
    table.string('is_verified').notNullable().defaultTo(false)
  })

  await knex.schema.createTable('verification_token', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE')
    table.string('token').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('NOW()'))
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('feature')
  await knex.schema.dropTable('flag')
}
