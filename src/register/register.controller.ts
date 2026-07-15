import type { NextFunction, Request, Response } from "express";
import type { RegisterService } from "./register.service";
import { registerSchema } from "./register.schema";
import { success } from "zod";

export class RegisterController{
    constructor(private service:RegisterService){}

    register = async (req:Request, res:Response, next:NextFunction) => {
        const data = registerSchema.safeParse(req.body)
        if(!data.success){
            return next(data.error)
        }

        try {
            await this.service.register(data.data)

            return res.status(201).json({message:"usuario registrado", success:true})
        } catch (error) {
            console.error(error)
            return next(error)
        }
    }
}