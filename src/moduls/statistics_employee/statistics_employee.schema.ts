import z from 'zod'
import { type RowDataPacket } from "mysql2"

export const statisticsEmployeeSchema = z.object({
    time: z.string(),
    branchId: z.string().optional(),
    name: z.string().optional()
})


export interface Result extends RowDataPacket {
    id: number,
    user_name: string,
    branch_name: string,
    total: number,
    date: string
}