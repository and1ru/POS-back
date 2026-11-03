import type { RowDataPacket } from 'mysql2';
import z from 'zod'

export const statisticsBranchSchema = z.object({
    time: z.string(),
    branchId: z.string().optional()
})

export interface statisticsBranchResponse extends RowDataPacket {
    id:number;
    name:string;
    total: number;
    date: string;
}