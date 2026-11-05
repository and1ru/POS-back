import z from 'zod'

export const branchSchema = z.object({
    name: z.string().min(1, "branch name is required"),
    city: z.string().min(1, "city is required"),
    address: z.string().min(1, "address is required")
})

export type branchType = z.infer<typeof branchSchema>