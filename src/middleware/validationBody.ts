import type { NextFunction, Response, Request } from "express"
import type { ZodType } from "zod"

export const validationBody = (schema:ZodType) => {
    return (req:Request, _res:Response, next:NextFunction) => {
        const data = schema.safeParse(req.body)

        if(!data.success){
            return next(data.error)
        }

        req.body = data.data

        next()
    }
}