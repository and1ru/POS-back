import type { RowDataPacket } from "mysql2"

export interface EmployeeResult extends RowDataPacket {
    name:string
    role:string
    salary:number
    branch_name:string
    branch_id:number
    date: Date
    id:number
}