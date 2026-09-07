import z from 'zod'

export const updateProductSchema = z.object({
    productId: z.number(),
    price: z.number(),
    stock: z.number()
})
