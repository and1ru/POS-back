import type { RowDataPacket } from "mysql2";

export interface DBResponse extends RowDataPacket {
    user_name:string;
    role:string
    branch_name:string | null
}