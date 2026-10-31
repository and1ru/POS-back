import { myDb } from "../../helper/pool"

export const statisticsProductsRepositoryOwner = async (companyId:number, branchId:string, productName:string, start:string, end:string, groupDate:string) => {
    const [result] = await myDb.query(
    `select
	    p.name,
        SUM(sp.quantity) as quantity,
        SUM(sp.price * sp.quantity) as total,
        ${groupDate} as date
    from products p
    inner join branch_products bp on bp.product_id = p.id
    inner join sale_product sp on sp.branch_product_id = bp.id
    inner join sales s on sp.sale_id = s.id

    where 
	    p.company_id = ?
        AND s.branch_id like ?
        AND p.name like ? 
        AND s.date between ? AND ?
    group by p.id, p.name, ${groupDate}
    order by ${groupDate}
    `,[companyId, branchId, productName, start, end])
    return result
}

export const statisticsProductsRepositoryAdmin = async (groupDate:string, companyId:number, userId:number, name:string, start:string, end:string) => {
    const [result] = await myDb.query(`
        select
	    p.name,
        SUM(sp.quantity) as quantity,
        SUM(sp.price * sp.quantity) as total,
        ${groupDate} as date
    from products p
    inner join branch_products bp on bp.product_id = p.id
    inner join sale_product sp on sp.branch_product_id = bp.id
    inner join sales s on sp.sale_id = s.id

    where 
	    p.company_id = ?
        AND s.branch_id = ( select branch_id from employees where user_id = ? )
        AND p.name like ? 
        AND s.date between ? AND ?
    group by p.id, p.name, ${groupDate}
    order by ${groupDate}
        `,[companyId, userId, name, start, end])

    return result
}