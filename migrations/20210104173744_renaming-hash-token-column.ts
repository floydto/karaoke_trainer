import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('singing_record_token');
    if (hasTable) {
        await knex.schema.alterTable('singing_record_token',(table)=>{
            table.renameColumn("hash","token");
        });  
    }
}


export async function down(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('singing_record_token');
    if (hasTable) {
        await knex.schema.alterTable('singing_record_token',(table)=>{
            table.renameColumn("token","hash");
        });  
    }
}

