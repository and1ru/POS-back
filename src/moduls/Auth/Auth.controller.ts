import type { NextFunction, Request, Response} from 'express'
import { CustomError } from '../../helper/cutomError'
import type { AuthService } from './Auth.service'
export class AuthController{
    constructor(private service:AuthService){}
    auth = async (req:Request, res:Response, next:NextFunction) => {
        const userId = req.user?.userId
        if(!userId) return next(new CustomError(401, "user not authenticated"))
        
        try {
            const { role, name } = await this.service.auth(userId)
            const result = {role, name}
            return res.status(200).json({message:"authenticado", success:true, result})
        } catch (error) {
            return next(error)
        }
    }
}