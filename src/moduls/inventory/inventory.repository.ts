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
            bp.id as branch_product_id,
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

export const inventoryRepositoryCashier = async (name:string) => {
    const [result] = await myDb.query(`
        SELECT
	        bp.sellPriceProduct,
	        bp.id,
            bp.stock,
            p.name,
            p.image_url
        FROM branch_products bp
        LEFT JOIN products p ON bp.product_id = p.id

        WHERE p.name like ?
        `, [name])
    return result
}