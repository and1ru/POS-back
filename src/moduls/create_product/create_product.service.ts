import { uploadImage } from "../../helper/cloudinary"
import { CreateProductRepository } from "./create_product.repository";

interface Result {
    public_id: string;
    secure_url: string
}

export class CreateProductService{
    createProduct = async (name:string, image:Express.Multer.File, companyId:number) => {
        const generateImg:Result = await uploadImage(image.buffer, image.mimetype)
        const { secure_url, public_id} = generateImg
        await CreateProductRepository(name, secure_url, public_id, companyId)
    }
}