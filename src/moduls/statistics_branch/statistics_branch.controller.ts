import type { NextFunction, Request, Response } from "express";
import type { StatisticsBranchService } from "./statistics_branch.service";

export class StatisticsBranchController {
    constructor(private service:StatisticsBranchService){}
    statisticsBranch = async (req:Request ,res:Response, next:NextFunction) => {

    }
}