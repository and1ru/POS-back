import { beforeEach, describe, expect, it, vi } from "vitest";
import { hireByAdmin, hireByOwner } from "../Hire.repository";
import { myDb } from "../../../helper/pool";

vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository POST /hire", () => {
    const hireData = {
        name: "Employee One",
        email: "employee@test.com",
        password: "hashed-password",
        role: "cashier",
        companyId: 1,
        branchId: 2,
        userId: 3,
        date: "2026-11-04",
        salary: 1500
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("hireByOwner", () => {
        it("should hire an employee successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([{}] as any);

            await hireByOwner(
                hireData.name,
                hireData.email,
                hireData.password,
                hireData.role,
                hireData.companyId,
                hireData.branchId,
                hireData.salary,
                hireData.date
            );

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("start transaction"),
                [
                    hireData.name,
                    hireData.email,
                    hireData.password,
                    hireData.role,
                    hireData.companyId,
                    hireData.branchId,
                    hireData.date,
                    hireData.salary
                ]
            );
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                hireByOwner(
                    hireData.name,
                    hireData.email,
                    hireData.password,
                    hireData.role,
                    hireData.companyId,
                    hireData.branchId,
                    hireData.salary,
                    hireData.date
                )
            ).rejects.toBe(error);
        });
    });

    describe("hireByAdmin", () => {
        it("should hire a cashier successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([{}] as any);

            await hireByAdmin(
                hireData.name,
                hireData.email,
                hireData.password,
                hireData.companyId,
                hireData.userId,
                hireData.date,
                hireData.salary
            );

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("start transaction"),
                [
                    hireData.name,
                    hireData.email,
                    hireData.password,
                    "cashier",
                    hireData.companyId,
                    hireData.userId,
                    hireData.date,
                    hireData.salary
                ]
            );
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                hireByAdmin(
                    hireData.name,
                    hireData.email,
                    hireData.password,
                    hireData.companyId,
                    hireData.userId,
                    hireData.date,
                    hireData.salary
                )
            ).rejects.toBe(error);
        });
    });
});