import type { RowDataPacket } from 'mysql2'
import z from 'zod'

export const statisticsProductsSchema = z.object({
    branchId: z.string().optional(),
    name: z.string().optional(),
    time: z.string()
})

export interface statisticsProductsDB extends RowDataPacket {
    id: number
    name: string
    quantity: number
    total: number
    date: string
}