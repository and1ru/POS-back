import z from 'zod'

export const statisticsProductsSchema = z.object({
    branchId: z.string().optional(),
    name: z.string().optional(),
    time: z.string()
})