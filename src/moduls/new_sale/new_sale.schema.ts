import z from 'zod'

export const product = z.object({
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    id: z.number().int().positive(),
})

export type productType = z.infer<typeof product>

export const newSale = z.object({
    amountReceived: z.number().positive(),
    products: z.array(product).min(1)
})