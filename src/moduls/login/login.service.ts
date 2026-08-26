import { comparePassword } from "../../helper/comparePassword"
import { CustomError } from "../../helper/cutomError"
import { generateToken } from "../../helper/generateToken"
import { loginRepository } from "./login.repository"
import type { loginType } from "./login.schema"

export class LoginService {
    login = async (user:loginType) => {
        const { email, password} = user
        // verificar que el usuario exista
        const result = await loginRepository(email)
        if(!result){
            throw new CustomError(400, "no existe usuario con ese email")
        }

        // verificar que las contraseñas coincidan
        const verifyPassword = await comparePassword(password, result.password)
        if(!verifyPassword){
            throw new CustomError(400, "contraseñas no coinciden")
        }

        const { id, role, company_id } = result
        const token = generateToken({ userId:id, role, companyId:company_id })

        return {token}
    }
}