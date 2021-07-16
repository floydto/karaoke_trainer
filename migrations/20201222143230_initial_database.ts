import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', table => {
        table.increments();
        table.string('username')
        table.string('password')
        table.string('email')
        table.string('icon')
        table.timestamps(false, true)
        table.timestamp('last_login_time',{useTz:true})
    })

    await knex.schema.createTable('singing_record', table => {
        table.increments();
        table.string('song_name')
        table.string('song_file')
        table.string('recording_file')
        table.json('result')
        table.string('lyrics')
        table.string('notes')
        table.timestamps(false, true)
        table.integer('user_id')
        table.foreign('user_id').references('user.id')

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('singing_record')
    await knex.schema.dropTable('user')
}

