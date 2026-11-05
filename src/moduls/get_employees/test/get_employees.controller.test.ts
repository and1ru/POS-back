import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeesService } from "../get_employees.service";
import { EmployeesController } from "../get_employees.controller";

describe("Controller GET /employees", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let service: EmployeesService;
    let controller: EmployeesController;

    const employeesResult = [
        {
            id: 4,
            name: "Ana Lopez",
            role: "cashier",
            branch_name: "Branch One"
        }
    ];

    beforeEach(() => {
        req = {
            query: {
                employeeName: "Ana",
                employeeRole: "cashier",
                employeeBranch: "1"
            },
            user: {
                companyId: 1,
                userId: 1,
                role: "owner"
            }
        } as unknown as Request;

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        next = vi.fn();

        service = {
            employee: vi.fn()
        } as unknown as EmployeesService;

        controller = new EmployeesController(service);
    });

    it("should get employees successfully", async () => {
        vi.mocked(service.employee).mockResolvedValue(employeesResult as any);

        await controller.employees(req, res, next);

        expect(service.employee).toHaveBeenCalledWith(
            "owner",
            1,
            1,
            "Ana",
            "cashier",
            "1"
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "got employees",
            success: true,
            result: employeesResult
        });

        expect(next).not.toHaveBeenCalled();
    });

    it.each([
        "employeeName",
        "employeeRole",
        "employeeBranch"
    ] as const)("should return 400 if %s is an array", async (parameter) => {
        req.query = {
            [parameter]: ["value1", "value2"]
        } as any;

        await controller.employees(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "",
            success: false
        });

        expect(service.employee).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the service throws an error", async () => {
        const error = new Error("database error");

        vi.mocked(service.employee).mockRejectedValue(error);

        await controller.employees(req, res, next);

        expect(service.employee).toHaveBeenCalledWith(
            "owner",
            1,
            1,
            "Ana",
            "cashier",
            "1"
        );

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});