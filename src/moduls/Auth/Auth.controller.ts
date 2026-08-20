import type { NextFunction, Request, Response} from 'express'
import { CustomError } from '../../helper/cutomError'
import type { AuthService } from './Auth.service'
export class AuthController{
    constructor(private service:AuthService){}
    auth = async (req:Request, res:Response, next:NextFunction) => {
        const userId = req.user?.id
        if(!userId){
            return next(new CustomError(401, "user not authenticated"))
        }

        try {
            const { role } = await this.service.auth(userId)
            return res.status(200).json({message:"authenticado", success:true, role })
        } catch (error) {
            console.error(error)
            return next(error)
        }
    }
}