import type { NextFunction, Request, Response } from "express"
import { CustomError } from "../../helper/cutomError"

export const authRole = (...role:string[]) => {
    return (req: Request, _res: Response, next:NextFunction) => {
        const user = req.user

        const verify = role.includes(user.role)

        if(!verify){
            return next(new CustomError(403, "user no authorizated"))
        }

        next()
    }
}