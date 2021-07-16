import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('singing_record_token');
    if (!hasTable) {
        return knex.schema.createTable('singing_record_token', (table) => {
            table.increments();
            table.string('hash');
            table.integer('record').unsigned();
            table.foreign('record').references('singing_record.id');
            table.timestamps(false, true);
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('singing_record_token');
}

