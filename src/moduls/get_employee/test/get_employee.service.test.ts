import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetEmployeeService } from "../get_employee.service";
import { getEmployeeAdmin, getEmployeeOwner } from "../get_employee.repository";
import type { EmployeeResult } from "../get_employee.schema";

vi.mock("./get_employee.repository", () => ({
    getEmployeeAdmin: vi.fn(),
    getEmployeeOwner: vi.fn()
}));

describe("Service GET /employee", () => {
    let service: GetEmployeeService;

    const employeeId = 5;
    const companyId = 1;
    const userId = 2;

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
        vi.clearAllMocks();

        service = new GetEmployeeService();
    });

    describe("employee as owner", () => {
        it("should get an employee successfully", async () => {
            vi.mocked(getEmployeeOwner).mockResolvedValue(employeeResult);

            const result = await service.employee(
                employeeId,
                companyId,
                "owner",
                userId
            );

            expect(getEmployeeOwner).toHaveBeenCalledWith(
                employeeId,
                companyId
            );

            expect(getEmployeeAdmin).not.toHaveBeenCalled();
            expect(result).toEqual(employeeResult);
        });

        it("should throw an error if the employee does not exist", async () => {
            vi.mocked(getEmployeeOwner).mockResolvedValue(undefined);

            await expect(
                service.employee(employeeId, companyId, "owner", userId)
            ).rejects.toThrow("user not found");

            expect(getEmployeeOwner).toHaveBeenCalledWith(
                employeeId,
                companyId
            );

            expect(getEmployeeAdmin).not.toHaveBeenCalled();
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(getEmployeeOwner).mockRejectedValue(error);

            await expect(
                service.employee(employeeId, companyId, "owner", userId)
            ).rejects.toBe(error);
        });
    });

    describe("employee as admin", () => {
        it("should get an employee successfully", async () => {
            vi.mocked(getEmployeeAdmin).mockResolvedValue(employeeResult);

            const result = await service.employee(
                employeeId,
                companyId,
                "admin",
                userId
            );

            expect(getEmployeeAdmin).toHaveBeenCalledWith(
                employeeId,
                userId
            );

            expect(getEmployeeOwner).not.toHaveBeenCalled();
            expect(result).toEqual(employeeResult);
        });

        it("should throw an error if the employee does not exist", async () => {
            vi.mocked(getEmployeeAdmin).mockResolvedValue(undefined);

            await expect(
                service.employee(employeeId, companyId, "admin", userId)
            ).rejects.toThrow("user not found");

            expect(getEmployeeAdmin).toHaveBeenCalledWith(
                employeeId,
                userId
            );

            expect(getEmployeeOwner).not.toHaveBeenCalled();
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(getEmployeeAdmin).mockRejectedValue(error);

            await expect(
                service.employee(employeeId, companyId, "admin", userId)
            ).rejects.toBe(error);
        });
    });

    it("should not query repositories for an unsupported role", async () => {
        const result = await service.employee(
            employeeId,
            companyId,
            "cashier",
            userId
        );

        expect(result).toBeUndefined();
        expect(getEmployeeOwner).not.toHaveBeenCalled();
        expect(getEmployeeAdmin).not.toHaveBeenCalled();
    });
});