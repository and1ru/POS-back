import z from 'zod'

export const updateEmployeeSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Name is required"),
    salary: z.number().positive(),
    role: z.enum(["admin", "cashier"]),
    branch: z.number().int().positive()
})