import z from 'zod'

export const loginSchema = z.object({
    email: z.email("most be an email").min(1,"is required"),
    password: z.string().min(8,"min length is 8")
})

export type loginType = z.infer<typeof loginSchema>