import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../../helper/pool";
import { getEmployeeOwner, getEmployeeAdmin } from "../get_employee.repository";

vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository GET /employee", () => {
    const employeeResult = {
        id: 5,
        name: "Employee One",
        role: "cashier",
        date: "2026-11-04",
        salary: 1500,
        branch_name: "Branch One",
        branch_id: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getEmployeeOwner", () => {
        it("should get an employee successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[employeeResult]] as any);

            const result = await getEmployeeOwner(5, 1);

            expect(result).toEqual(employeeResult);
        });

        it("should return undefined if the employee does not exist", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await getEmployeeOwner(999, 1);

            expect(result).toBeUndefined();
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                getEmployeeOwner(5, 1)
            ).rejects.toBe(error);
        });
    });

    describe("getEmployeeAdmin", () => {
        it("should get an employee successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[employeeResult]] as any);

            const result = await getEmployeeAdmin(5, 2);

            expect(result).toEqual(employeeResult);
        });

        it("should return undefined if the employee does not exist", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await getEmployeeAdmin(999, 2);

            expect(result).toBeUndefined();
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                getEmployeeAdmin(5, 2)
            ).rejects.toBe(error);
        });
    });
});