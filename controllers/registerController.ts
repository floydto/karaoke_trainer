import express from "express";
import registerService from "../services/registerService"
import path from "path";
import { hashPassword } from "../hash";


class registerController {
    constructor(public registerService: registerService) {}
  
    get = async (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, "../public/signup.html"));
    };
    
    post = async (req: express.Request, res: express.Response) => {
      try {
        const { username, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
          return res.redirect("/signup.html?error=Password+confirmation+does+not+match");
        }
        
        let checkEmailAndUsername = await this.registerService.toCheckEmailAndUsername(email, username)
        if (checkEmailAndUsername.length >= 1) {
          return res.redirect("/signup.html?error=Email+has+already+been+registered");
        }
        if (this.validUser(email, password)) {
          const hashedPassword = await hashPassword(password);
          await this.registerService.toRegister(username, hashedPassword, req.file?.filename || "anonymous.png", email)
        } else {
          res.redirect(
            "/signup.html?error=Please+enter+a+valid+email"
          );
        }
        res.redirect("/index.html?success=Registration+successes");
      } catch (error) {
        return res.status(500).json(error.toString());
      }
    };
    validUser = (email:string, password:string) => {
      const validEmail = typeof email === "string" && email.trim() !== "";
      const validPassword =
        typeof password === "string" &&
        password.trim() !== "" &&
        password.trim().length >= 6;
      return validEmail && validPassword;
    };
  
  }
  
  export default registerController;
  