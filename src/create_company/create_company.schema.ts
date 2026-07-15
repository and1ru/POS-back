import z from 'zod'

export const createCompanySchema = z.object({
    name: z.string()
})

export type createCompanyType = z.infer<typeof createCompanySchema>