import z from 'zod'

export const statisticsEmployeeSchema = z.object({
    time: z.string(),
    branchId: z.string().optional(),
    name: z.string().optional()
})