import type { RowDataPacket } from "mysql2"
import { myDb } from "../../helper/pool"

export const inventoryRepositoryOwner = async (companyId: number, productName: string) => {
    const [result] = await myDb.query("SELECT id, name, image_url FROM products where company_id=? AND name LIKE ? ", [companyId, productName])
    return result
}

export const inventoryRepositoryAdmin = async (userId: number, productName:string, price:string, stock:string) => {
    const [result] = await myDb.query(`
        SELECT
	        p.name,
	        p.image_url,
	        p.id,
	        bp.stock,
	        bp.minStock,
            bp.boughtPriceProduct,
            bp.sellPriceProduct,
        
        CASE WHEN bp.id IS NULL 
            THEN FALSE
	        ELSE TRUE
        END AS is_in_branch

        FROM products p
        LEFT JOIN branch_products bp
            ON p.id = bp.product_id
            AND bp.branch_id = ( select branch_id from employees where user_id = ? ) 
        
        WHERE p.name like ?

        ORDER BY 
			is_in_branch DESC,
            CASE WHEN ? = 'desc' THEN bp.stock END DESC,
            CASE WHEN ? = 'asc' THEN bp.stock END ASC,
			CASE WHEN ? = 'desc' THEN bp.sellPriceProduct END DESC,
            CASE WHEN ? = 'asc' THEN bp.sellPriceProduct END ASC;
        `, [userId, productName, stock, stock, price, price])

    return result
}

interface ResultEmployee extends RowDataPacket {
    branch_id: number
}

export const inventoryRepositoryCashier = async (userId: number) => {
    const [user] = await myDb.query<ResultEmployee[]>("select branch_id from employee where user_id = ? ", [userId])
    const [result] = await myDb.query("SELECT p.name, p.image_url, bp.id, bp.price, bp.stock FROM products p LEFT JOIN branch_products bp ON p.id = bp.product_id AND bp.branch_id = ?", [user[0]!.branch_id])
    return result
}