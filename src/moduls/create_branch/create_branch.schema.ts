import z from 'zod'

export const branchSchema = z.object({
    name: z.string(),
    city: z.string(),
    address: z.string()
})

export type branchType = z.infer<typeof branchSchema>