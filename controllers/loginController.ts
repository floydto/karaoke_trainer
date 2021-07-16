import express from "express";
import LoginService from "../services/loginServices";
import path from "path";
import { checkPassword, hashPassword } from "../hash";
import fetch from 'node-fetch'


// using declaration merging for express-session
declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}

class LoginController {
    constructor(public LoginService: LoginService) { }

    get = async (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(__dirname, "../public/login.html"));
    };

    post = async (req: express.Request, res: express.Response) => {
        try {
            const { email, password } = req.body;
            let checkEmailResult = await this.LoginService.checkEmail(email)
            if (checkEmailResult.length !== 1) {
                return res
                    .status(401)
                    .redirect("/login.html?error=Please+enter+correct+email+and+password");
            }
            console.log("login successes")
            const hashedPassword = checkEmailResult[0].password;
            const match = await checkPassword(password, hashedPassword);
            if (!match) {
                return res
                    .status(401)
                    .redirect("/login.html?error=Please+enter+correct+email+and+password");
            }
            if (req.session) {
                req.session.user = {
                    id: checkEmailResult[0].id,
                };
                res.redirect("/");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            return res.status(500).json(error.toString());
        }
    };
    getLogout = async (req: express.Request, res: express.Response) => {
        if (req.session) {
            delete req.session.user;
        }
        res.redirect("/login.html");
    }

    loginGoogle = async (req: express.Request, res: express.Response) => {
        try {
            const accessToken = req.session?.['grant'].response.access_token;
            const fetchRes = await fetch(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const result = await fetchRes.json();
            const users = await this.LoginService.getUser(result.email)
            const user = users[0];
            if (!user) {
                const { name, picture, email } = result;
                const hashedPassword = await hashPassword(this.makeId(10));
                let userId: any[] = await this.LoginService.toCreateUser(name, hashedPassword, picture, email)

                if (req.session) {
                    req.session.user = {
                        id: userId[0].id,
                    };
                }
            } else {
                if (req.session) {
                    req.session.user = {
                        id: user.id,
                    };
                }
            }
            return res.redirect("/");
        } catch (e) {
            console.log("loginGoogle: ", e)
        }

    }

    makeId = (length:any) => {
        let result = "";
        let characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    fetchUserData = async (req: express.Request, res: express.Response) => {
        let result = {}
        if (req.session && req.session.user) {
            result = await this.LoginService.fetchUserData(req.session.user.id)
            return res.json({ result, id: req.session.user.id })
        }
        return res.json(result)
    }
}

export default LoginController;
