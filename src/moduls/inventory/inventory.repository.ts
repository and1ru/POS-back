import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

export const inventoryRepositoryOwner = async (companyId:number) => {
    const [result] = await myDb.query("SELECT id, name, image_url FROM products where company_id=? ",[companyId])
    return result
}

interface ResultEmployee extends RowDataPacket{
    branch_id:number
}

export const inventoryRepositoryAdmin = async (userId:number) => {
    const [user] = await myDb.query<ResultEmployee[]>("select branch_id from employee where user_id = ? ",[userId])
    const [result] = await myDb.query(`
        SELECT
    p.id,
    p.name,
    p.image_url,
    bp.price,
    bp.stock,
    CASE
        WHEN bp.id IS NULL THEN FALSE
        ELSE TRUE
    END AS is_in_branch
FROM products p
LEFT JOIN branch_products bp
    ON p.id = bp.product_id
    AND bp.branch_id = ? ORDER BY is_in_branch DESC
        `,[user[0]!.branch_id])

    return result
}

export const inventoryRepositoryCashier = async (userId:number) => {
    const [user] = await myDb.query<ResultEmployee[]>("select branch_id from employee where user_id = ? ",[userId])
    const [result] = await myDb.query("SELECT p.name, p.image_url, bp.id, bp.price, bp.stock FROM products p LEFT JOIN branch_products bp ON p.id = bp.product_id AND bp.branch_id = ?", [user[0]!.branch_id])
    return result
}