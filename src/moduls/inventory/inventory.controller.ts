import type { NextFunction, Request, Response } from "express";
import type { InventoryService } from "./inventory.service";

export class InventoryController {
    constructor(private service:InventoryService){}

    inventory = async (req:Request, res:Response, next:NextFunction) => {
        const { companyId, userId, role} = req.user
        const { productName } = req.query

        if(typeof productName !== "string" && productName !== undefined){
            return res.status(400).json({ message: "", success:false })
        }

        try {
            const result = await this.service.intentory(role, companyId, userId, productName)
            return res.status(200).json({message:"got products", success:true, result})
        } catch (error) {
            next(error)
        }
    }
}