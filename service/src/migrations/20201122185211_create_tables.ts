import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('feature', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name').notNullable()
    table.string('key').notNullable().unique()
  })

  await knex.schema.createTable('flag', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('feature_id').notNullable().references('id').inTable('feature').onDelete('CASCADE')
    table.string('name').notNullable()
    table.boolean('enabled').notNullable().defaultTo(false)
    table.jsonb('predicates').notNullable().defaultTo([])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('feature')
  await knex.schema.dropTable('flag')
}
