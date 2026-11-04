import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Payload } from '../types/jwt.payload'
import { CustomError } from '../helper/cutomError'

export const authToken = (req:Request, _res:Response, next:NextFunction) => {
    const token = req.cookies.token
    if(!token){
        next(new CustomError(401, "no token"))
    }
    try {
        const verify = jwt.verify(token, "palabra_secreta") as Payload
        req.user = verify
        next()
    } catch (error) {
        next(error)
    }
}