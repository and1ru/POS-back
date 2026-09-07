import type { NextFunction, Request, Response } from "express";
import type { InventoryService } from "./inventory.service";

export class InventoryController {
    constructor(private service:InventoryService){}

    inventory = async (req:Request, res:Response, next:NextFunction) => {
        const companyId = req.user?.companyId
        const userRole = req.user?.role
        const userId = req.user?.userId

        if(!companyId || !userRole || !userId){
            return res.status(401).json({message:"no authenticated", success:false})
        }

        try {
            const result = await this.service.intentory(userRole, companyId, userId)
            return res.status(200).json({message:"got products", success:true, result})
        } catch (error) {
            next(error)
        }
    }
}