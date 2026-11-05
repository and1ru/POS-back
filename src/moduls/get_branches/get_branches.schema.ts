import type { RowDataPacket } from "mysql2"

export interface DbResponse extends RowDataPacket{
    name:string;
    id:number;
    city:string;
}