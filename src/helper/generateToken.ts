import jwt from 'jsonwebtoken'
import type { Payload } from '../types/jwt.payload'

export const generateToken = (payload:Payload) => {
    return jwt.sign(
        payload, 
        "palabra_secreta",
        {
            expiresIn: "1h",
        }
    )
}