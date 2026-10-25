import { uploadImage } from "../../helper/cloudinary";
import { updateProduct } from "./update_product.repository";

interface Result {
    public_id: string;
    secure_url: string
}

export class UpdateProductService {
    updateProduct = async (name:string | undefined, image:Express.Multer.File | undefined, id:number) => {
        // si envia una imagen tiene que eliminar la que ya existe y insertar la nueva
        let secure_url:string | null = null;
        let public_id:string | null = null;

        let newName:null | string = null

        if(image){
            const generateImg:Result = await uploadImage(image.buffer)
            secure_url = generateImg.secure_url
            public_id = generateImg.public_id
        }

        if(name){
            newName = name
        }

        await updateProduct(newName, secure_url, public_id, id)

        // si puede cambiar el producto todo bien pero si no entonces eliminar la imagen
    }
}