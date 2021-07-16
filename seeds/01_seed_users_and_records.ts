import * as Knex from "knex";
import bcryptjs from 'bcryptjs'

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    const userIds = await knex("user").insert([
        {username: 'grace', 
        password: await bcryptjs.hash('123456', 10), 
        email:'grace@gmail.com', 
        icon:'grace.jpg'},

        {username: 'ben', 
        password: await bcryptjs.hash('123456', 10), 
        email:'ben@gmail.com', 
        icon:'ben.jpg'},

        {username: 'mary', 
        password: await bcryptjs.hash('123456', 10), 
        email:'mary@gmail.com', 
        icon:'mary.jpg'},

        {username: 'floyd', 
        password: await bcryptjs.hash('123456', 10), 
        email:'floyd@gmail.com', 
        icon:'floyd.jpg'},
    ]).returning('id');

    await knex("singing_record").insert([
        {song_name: 'moonriver', 
        song_file: 'moonriver.mp3', 
        recording_file:'record01.mp3', 
        result:'{}', 
        lyrics:'Moon river, wider than a mile' , 
        notes:'enjoy it', 
        user_id:userIds[0]},

        {song_name: 'moonriver', 
        song_file: 'moonriver.mp3', 
        recording_file:'record02.mp3', 
        result:'{}', 
        lyrics:'Moon river, wider than a mile' , 
        notes:'enjoy it', 
        user_id:userIds[1]},

        {song_name: 'moonriver', 
        song_file: 'moonriver.mp3', 
        recording_file:'record03.mp3', 
        result:'{}', 
        lyrics:'Moon river, wider than a mile' , 
        notes:'enjoy it', 
        user_id:userIds[2]},,
    ]);
};
