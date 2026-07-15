import { comparePassword } from "../helper/comparePassword"
import { CustomError } from "../helper/cutomError"
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
        // retornar el usuario
        return result
    }
}