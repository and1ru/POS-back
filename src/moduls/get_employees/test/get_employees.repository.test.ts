import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../../helper/pool";
import { employeesAdmin, employeesOwner } from "../get_employees.repository";


vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository GET /employees", () => {
    const employeesResult = [
        {
            id: 4,
            name: "Ana Lopez",
            role: "cashier",
            branch_name: "Branch One"
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("employeesAdmin", () => {
        it("should get employees successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([employeesResult] as any);

            const result = await employeesAdmin(2, "%Ana%");

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("users.name like ?"),
                [2, "%Ana%"]
            );

            expect(result).toEqual(employeesResult);
        });

        it("should return an empty array if there are no employees", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await employeesAdmin(2, "%Nobody%");

            expect(result).toEqual([]);
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                employeesAdmin(2, "%Ana%")
            ).rejects.toBe(error);
        });
    });

    describe("employeesOwner", () => {
        it("should get employees successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([employeesResult] as any);

            const result = await employeesOwner(
                1,
                "%Ana%",
                "%cashier%",
                "%1%"
            );

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("users.company_id = ?"),
                [1, "%Ana%", "%cashier%", "%1%"]
            );

            expect(result).toEqual(employeesResult);
        });

        it("should return an empty array if there are no employees", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await employeesOwner(
                1,
                "%Nobody%",
                "%cashier%",
                "%"
            );

            expect(result).toEqual([]);
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                employeesOwner(
                    1,
                    "%Ana%",
                    "%cashier%",
                    "%1%"
                )
            ).rejects.toBe(error);
        });
    });
});