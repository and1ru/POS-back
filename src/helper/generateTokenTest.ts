import { generateToken } from "./generateToken"

export const generateTokenTest = (companyId:number, role:string, userId:number) => {
    const token = generateToken({companyId, role, userId})
    return [`token=${token}`]
}