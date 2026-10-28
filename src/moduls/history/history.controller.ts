import type { NextFunction, Request, Response } from "express";
import type { HistoryService } from "./history.service";

export class HistoryController {
    constructor(private service:HistoryService){}
    history = async (req:Request , res:Response , next:NextFunction) => {
        const { userId, role } = req.user
        const { saleId, date } = req.query

        if(
            (typeof saleId !== "string" && saleId !== undefined) || 
            (typeof date !== "string" && date !== undefined)
        ){
            return res.status(400).json({message: "", success:false})
        }

        try {
            const result = await this.service.history(userId, role, saleId, date)
            return res.status(200).json({ message: "got sales history", success:true , result})
        } catch (error) {
            next(error)
        }
    }
}