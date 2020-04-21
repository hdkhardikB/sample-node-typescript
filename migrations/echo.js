exports.up = function up(knex) {
  return knex.schema.createTable('echo', table => {
    table.increments('id').primary()
    table.string('msg')
  })
}

exports.down = function down(knex) {
  return knex.schema.dropTable('echo')
}
