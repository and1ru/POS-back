import type { NextFunction, Request, Response } from "express";
import type { StatisticsProductsService } from "./statistics_products.service";

export class StatisticsProductsController {
    constructor(private service:StatisticsProductsService){}
    statisticsProducts = async (req:Request, res:Response, next:NextFunction) => {
        
    }
}