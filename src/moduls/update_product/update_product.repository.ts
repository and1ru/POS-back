import { myDb } from "../../helper/pool"

export const updateProduct = async (name:string | null, secure_url:string | null, public_id:string | null, id:number) => {
    await myDb.query(`
        update products set 
	        name = COALESCE(?, name),
	        image_id = COALESCE(?, image_id),
            image_url = COALESCE(?, image_url)
        where id = ?; 
    `, [ name, secure_url, public_id, id ])
}