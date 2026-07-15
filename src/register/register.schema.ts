import z from 'zod'

export const registerSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string()
})

export type registerType = z.infer<typeof registerSchema>