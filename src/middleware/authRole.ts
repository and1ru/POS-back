import type { NextFunction, Request, Response } from "express"
import { CustomError } from "../helper/cutomError"

export const authRole = (...role:string[]) => {
    return (req: Request, _res: Response, next:NextFunction) => {
        const user = req.user
        if(!user){
            return next(new CustomError(401, "user no authenticated"))
        }

        const verify = role.includes(user.role)

        if(!verify){
            return next(new CustomError(401, "user no authorizated"))
        }

        next()
    }
}