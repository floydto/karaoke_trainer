import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("singing_record_token").del();
    await knex("singing_record").del();
    await knex("login_token").del();
    await knex("user").del();
};
