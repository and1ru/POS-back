import type { NextFunction, Response, Request } from "express";
import type { StatisticsEmployeeService } from "./statistics_employee.service";

export class StatisticsEmployeeController {
    constructor(private service:StatisticsEmployeeService){}
    statisticsEmployee = async (req:Request, res:Response, next:NextFunction) => {

    }
}