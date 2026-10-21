import type { NextFunction, Request, Response } from "express";
import type { UpdateProductService } from "./update_product.service";

export class UpdateProductController {
    constructor(private service:UpdateProductService){}
    updateProduct = async (req:Request, res:Response, next:NextFunction) => {

    }
}