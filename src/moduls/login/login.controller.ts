import type { NextFunction, Request, Response } from "express";
import type { LoginService } from "./login.service";

export class LoginController{
    constructor(private service:LoginService){}

    login = async (req:Request, res:Response, next:NextFunction) => {
        const { email, password } = req.body

        try {
            const result = await this.service.login(email, password)
            res.cookie("token", result)
            return res.status(200).json({message:"se inicio sesion", success:true})
        } catch (error) {
            return next(error)
        }
    }
}