import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Payload } from '../types/jwt.payload'

export const authToken = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token
    if(!token){
        // poner el middleware de error
        return
    }
    try {
        const verify = jwt.verify(token, "palabra_secreta") as Payload

        req.user = verify

        next()
    } catch (error) {
        return res.status(400).json({message:"token no valido"})
    }
}