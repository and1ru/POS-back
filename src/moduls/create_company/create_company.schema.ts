import z from 'zod'

export const companySchema = z.object({
    companyName: z.string(),
    ownerName: z.string(),
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string()
})

export type companyType = z.infer<typeof companySchema>