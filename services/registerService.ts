import Knex from "knex";

export default class RegisterService {
    constructor(public knex: Knex) { }

    async toRegister(username: string, password: string, email: string, icon: string) {
        let ids = await this.knex.insert({
            username,
            password,
            email,
            icon: icon
        }).into("user")
            .returning('id');
        return ids
    }
    async toCheckEmailAndUsername(email: string, username: string) {
        const users = await this.knex.select('username')
            .from('user')
            .where('email', email)
            .orWhere('username', username)
        return users
    }
}