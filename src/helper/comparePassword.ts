import bcrypt from 'bcrypt'

export const comparePassword = async (newPassword:string, password:string) => {
    return await bcrypt.compare(newPassword, password)
}