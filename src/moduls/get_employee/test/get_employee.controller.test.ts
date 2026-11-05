import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetEmployeeService } from "../get_employee.service";
import { GetEmployeeController } from "../get_employee.controller";
import type { EmployeeResult } from "../get_employee.schema";

describe("Controller GET /employee", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: GetEmployeeService;
    let controller: GetEmployeeController;

    const employeeResult = {
        id: 5,
        name: "Employee One",
        role: "cashier",
        date: "2026-11-04",
        salary: 1500,
        branch_name: "Branch One",
        branch_id: 1
    } as unknown as EmployeeResult;

    beforeEach(() => {
        req = {
            params: {
                employeeId: "5"
            },
            user: {
                companyId: 1,
                role: "owner",
                userId: 1
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            employee: vi.fn()
        } as unknown as GetEmployeeService;

        controller = new GetEmployeeController(service);
    });

    it("should get an employee successfully", async () => {
        vi.mocked(service.employee).mockResolvedValue(employeeResult);

        await controller.employee(req, res, next);

        expect(service.employee).toHaveBeenCalledWith(5,1,"owner",1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "got employee",
            success: true,
            result: employeeResult
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 if employeeId is empty", async () => {
        req.params.employeeId = "";

        await controller.employee(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "employeeId is required",
            success: false
        });

        expect(service.employee).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.employee).mockRejectedValue(error);

        await controller.employee(req, res, next);

        expect(service.employee).toHaveBeenCalledWith(5,1,"owner",1);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});