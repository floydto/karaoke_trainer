import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('login_token');
    if (!hasTable) {
        return knex.schema.createTable('login_token', (table) => {
            table.increments();
            table.string('token');
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('user.id');
            table.timestamps(false, true);
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('login_token');
    if (hasTable) { 
        await knex.schema.dropTable('login_token')
    }
}

