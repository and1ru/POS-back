import type { NextFunction, Request, Response } from "express"
export class LogOutController{
    logOut = (req:Request, res:Response, next:NextFunction) => {
        try {
            res.clearCookie("token")
            return res.status(200).json({message:"log out successed", success:true})
        } catch (error) {
            return next(error)
        }
    }
}