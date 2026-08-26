import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface UserResponse extends RowDataPacket {
    email:string
}

interface EmployeeResponse extends RowDataPacket {
    company_id:number
}

export const CreateProductRepository = async (name:string, image:string, imageId:string, companyId:number) => {
    // inserta los datos de la imagen con el company_id
    await myDb.query("INSERT INTO products (name, image_url, company_id, image_id) VALUES (?,?,?,?)", [name, image, companyId, imageId])
}