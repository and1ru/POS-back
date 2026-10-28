import { myDb } from "../../helper/pool"

export const inventoryRepositoryOwner = async (companyId: number, productName: string) => {
    const [result] = await myDb.query(`
        SELECT 
            id, 
            name, 
            image_url 
        FROM products 
            where company_id=? AND 
            name LIKE ? 
        `, [companyId, productName])
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
			bp.branch_id,
        CASE 
			WHEN bp.id IS NULL 
				THEN FALSE
				ELSE TRUE
        END AS is_in_branch

        FROM products p 
        LEFT JOIN branch_products bp ON p.id = bp.product_id
        AND  bp.branch_id = ( select branch_id from employees where user_id = ? )
        
        WHERE 
			p.company_id = (select company_id from users where id = ?) AND
            p.name like ?

        ORDER BY 
			is_in_branch DESC,
            CASE WHEN ? = 'desc' THEN bp.stock END DESC,
            CASE WHEN ? = 'asc' THEN bp.stock END ASC,
			CASE WHEN ? = 'desc' THEN bp.sellPriceProduct END DESC,
            CASE WHEN ? = 'asc' THEN bp.sellPriceProduct END ASC;
        `, [userId,userId, productName, stock, stock, price, price])

    return result
}

export const inventoryRepositoryCashier = async (name:string, userId:number) => {
    const [result] = await myDb.query(`
        SELECT
	        bp.sellPriceProduct,
	        bp.id,
            bp.stock,
            p.name,
            p.image_url
        FROM branch_products bp
        INNER JOIN products p ON bp.product_id = p.id
		
        WHERE
            p.name like "%%" AND
            p.company_id = (select company_id from users where id = ?)
        `, [name, userId])
    return result
}