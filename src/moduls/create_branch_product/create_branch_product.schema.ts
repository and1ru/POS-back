import z from 'zod'

export const updateProductSchema = z.object({
    minStock: z.number().positive().int(),
    currentStock: z.number().positive().int(),
    boughtPriceProduct: z.number().positive(),
    sellPriceProduct: z.number().positive(),
    productId: z.number().int().positive()
})