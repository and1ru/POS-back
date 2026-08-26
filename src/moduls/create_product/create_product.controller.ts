import type { NextFunction,Request,Response } from "express";
import type { CreateProductService } from "./create_product.service";

export class CreateProductController {
    constructor(private service:CreateProductService){}
    createProduct = async (req:Request, res:Response, next:NextFunction) => {
        const { name } = req.body
        const image = req.file
        const companyId = req.user?.companyId
        if(!companyId){
            return res.status(401).json({message:"user no autheticated"})
        }
        if(!image){
            return res.status(400).json({message:"error de la imagen"})
        }
        try {
            await this.service.createProduct(name, image, companyId)
            return res.status(200).json({message:"all", success:true, result:{name, image}})
        } catch (error) {
            next(error)
        }
    }
}