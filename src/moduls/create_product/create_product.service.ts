import { uploadImage } from "../../helper/cloudinary"
import { CreateProductRepository } from "./create_product.repository";

interface Result {
    public_id: string;
    secure_url: string
}

export class CreateProductService{
    createProduct = async (userId:number,name:string, image:Express.Multer.File) => {
        const generateImg:Result = await uploadImage(image.buffer, image.mimetype)
        await CreateProductRepository(userId,name,generateImg.secure_url,generateImg.public_id)
    }
}