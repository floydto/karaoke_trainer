import Knex from "knex";

class LoginService {
    constructor(public knex: Knex) { }

    async toLogin(gameId: number) {

    }
    checkEmail = async (email: string) => {
        let result = await this.knex.select("password", "id")
            .from('user')
            .where('email', email)
        return result
    }
    getUser = async (email:string) => {
        let result = await this.knex.select("password", "id")
            .from('user')
            .where('email', email)
        return result
    }
    toCreateUser = async (name:string, hashedPassword:string, picture:string, email:string) => {
        let ids = await this.knex.insert({
            username: name,
            password: hashedPassword,
            icon: picture,
            email
        }).into("user")
            .returning('id');
        return ids
    }
    fetchUserData = async (id:string) => {
        let user = await this.knex('user').select('username', 'icon').where('id', id);
        return { user }
    }
}
export default LoginService;