import type { NextFunction, Request, Response } from "express"

export const authToken = (...role:string[]) => {
    return (req: Request, _res: Response, next:NextFunction) => {
        const user = req.user
        if(!user){
            // decir que no hay un usuario
            return
        }

        const verify = role.includes(user.rol)

        if(!verify){
            // decir que no tiene permiso
            return
        }

        next()
    }
}