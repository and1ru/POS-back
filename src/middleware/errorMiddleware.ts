import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../helper/cutomError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";

export const errorMiddleware = (err:unknown, req:Request, res:Response, next:NextFunction) => {
    if(err instanceof CustomError){
        return res.status(err.status).json({success:false, message:err.message})
    }

    if(err instanceof JsonWebTokenError){
        return res.status(401).json({success:false, message:"no token"})
    }

    if(err instanceof TokenExpiredError){
        return res.status(401).json({success:false, message:"expired token"})

    }

    if(err instanceof ZodError){
        return res.status(400).json({success:false, message:"validation error", errors: err.flatten().fieldErrors})
        
    }

    console.error(err)

    return res.status(500).json({status:false, message:"internal server error"})
}