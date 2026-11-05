import { CustomError } from "../../helper/cutomError"
import { AuthRepository } from "./Auth.repository"
import type { DBResponse } from "./Auth.schema"

export class AuthService {
    auth = async (userId: number) => {
        const response: DBResponse | undefined = await AuthRepository(userId)

        if (!response) {
            throw new CustomError(404, "did not find user")
        }

        return response
    }
}