import type { NextFunction, Request, Response } from "express";
import type { LoginService } from "./login.service";
import { loginSchema } from "./login.schema";

export class LoginController{
    constructor(private service:LoginService){}

    login = async (req:Request, res:Response, next:NextFunction) => {
        const data = loginSchema.safeParse(req.body)
        if(!data.success){
            return next(data.error)
        }

        try {
            await this.service.login(data.data)

            return res.status(200).json({message:"se inicio sesion", success:true})
        } catch (error) {
            return next(error)
        }
    }
}