import { comparePassword } from "../../helper/comparePassword"
import { CustomError } from "../../helper/cutomError"
import { generateToken } from "../../helper/generateToken"
import { loginRepository } from "./login.repository"

export class LoginService {
    login = async (email:string, password:string) => {
        const result = await loginRepository(email)
        if(!result){
            throw new CustomError(400, "no existe usuario con ese email")
        }

        const verifyPassword = await comparePassword(password, result.password)
        if(!verifyPassword){
            throw new CustomError(400, "contraseñas no coinciden")
        }

        const { id, role, company_id } = result
        return generateToken({ userId:id, role, companyId:company_id })
    }
}