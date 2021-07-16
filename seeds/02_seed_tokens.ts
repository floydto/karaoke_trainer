import * as Knex from "knex";
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    const userIDs = await knex.select('id')
        .from('user');

    const recordIDs = await knex.select('id')
        .from("singing_record");

    await knex("singing_record_token").insert([
        {
            record: recordIDs[0].id,
            token: await bcrypt.hash('123456', 10)
        },
        {
            record: recordIDs[1].id,
            token: await bcrypt.hash('123456', 10)
        },
        {
            record: recordIDs[2].id,
            token: await bcrypt.hash('123456', 10)
        }
    ])

    await knex("login_token").insert([
        {
            user_id: userIDs[0].id,
            token: await bcrypt.hash('123456', 10)
        },
        {
            user_id: userIDs[1].id,
            token: await bcrypt.hash('123456', 10)
        },
        {
            user_id: userIDs[2].id,
            token: await bcrypt.hash('123456', 10)
        }
    ])
};
