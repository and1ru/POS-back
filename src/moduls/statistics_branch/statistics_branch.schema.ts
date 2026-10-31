import z from 'zod'

export const statisticsBranchSchema = z.object({
    time: z.string(),
    branchId: z.string().optional()
})