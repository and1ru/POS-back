import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

interface UserResponse extends RowDataPacket {
    email:string
}

interface EmployeeResponse extends RowDataPacket {
    company_id:number
}

export const CreateProductRepository = async (userId:number, name:string, image:string, imageId:string) => {
    // obtiene el email
    const [users] = await myDb.query<UserResponse[]>("SELECT email FROM users WHERE user_id=?",[userId])
    const user = users[0]
    // con el email obtiene el company_id de la tabla employee
    const [employees] = await myDb.query<EmployeeResponse[]>("SELECT company_id FROM employees WHERE email=?",[user?.email])
    const employee = employees[0]
    // inserta los datos de la imagen con el company_id
    await myDb.query("INSERT INTO products (product_name, product_image, company_id, image_public_id) VALUES (?,?,?,?)", [name, image, employee?.company_id, imageId])
}