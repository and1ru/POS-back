import { CustomError } from "../helper/cutomError"
import { hashPassword } from "../helper/hashPassword"
import { findUser, registerRepository } from "./register.repository"
import type { registerType } from "./register.schema"

export class RegisterService {
    register = async (user:registerType) => {
        const { email, password, name } = user
        // verificar que el email no exista
        const verifyEmail = await findUser(email)

        if(verifyEmail){
            throw new CustomError(400, "el email esta en uso")
        }

        // hashear la contraseña
        const hashedPassword = await hashPassword(password)

        const newUser = {
            name,
            email,
            password:hashedPassword
        }

        await registerRepository(newUser)

    }
}