import type { NextFunction, Request, Response } from "express";
import type { UpdateProductService } from "./update_product.service";

export class UpdateProductController {
    constructor(private service:UpdateProductService){}
    updateProduct = async (req:Request, res:Response, next:NextFunction) => {
        console.log("controller")
        const { name, id } = req.body
        const image = req.file

        try {
            await this.service.updateProduct(name, image, Number(id))
            return res.status(200).json({ message:"product updated", success:true })
        } catch (error) {
            next(error)
        }
    }
}