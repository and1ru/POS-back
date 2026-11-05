import type { NextFunction, Request, Response} from 'express'
import type { AuthService } from './Auth.service'

export class AuthController{
    constructor(private service:AuthService){}
    auth = async (req:Request, res:Response, next:NextFunction) => {
        const { userId } = req.user
        
        try {
            const result = await this.service.auth(userId)
            return res.status(200).json({message:"authenticated", success:true, result})
        } catch (error) {
            return next(error)
        }
    }
}