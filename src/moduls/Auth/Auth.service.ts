import { CustomError } from "../../helper/cutomError"
import { AuthRepository } from "./Auth.repository"

export class AuthService {
    auth = async (userId:number) => {
        const response = await AuthRepository(userId)
        if(!response){
            throw new CustomError(404, "no user")
        }

        const { role, name } = response

        return { role, name }
    }
}