import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../../helper/pool";
import { historyAdmin, historyCashier, historyOwner } from "../history.repository";

vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository GET /history", () => {
    const historyResult = [
        {
            id: 15,
            total_price: 50000,
            date: "2026-11-04 10:00:00",
            quantity: 3,
            products: 2
        }
    ];

    const userId = 3;
    const saleId = "%15%";
    const dateStart = "2026-11-04 00:00:00";
    const dateEnd = "2026-11-05 00:00:00";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("historyCashier", () => {
        it("should get cashier history successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([historyResult] as any);

            const result = await historyCashier(
                userId,
                saleId,
                dateStart,
                dateEnd
            );

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("s.user_id = ?"),
                [userId, saleId, dateStart, dateEnd]
            );

            expect(result).toEqual(historyResult);
        });

        it("should return an empty array if there is no history", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await historyCashier(
                userId,
                saleId,
                dateStart,
                dateEnd
            );

            expect(result).toEqual([]);
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                historyCashier(userId, saleId, dateStart, dateEnd)
            ).rejects.toBe(error);
        });
    });

    describe("historyAdmin", () => {
        it("should get admin history successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([historyResult] as any);

            const result = await historyAdmin(
                userId,
                saleId,
                dateStart,
                dateEnd
            );

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("select branch_id from employees where user_id = ?"),
                [userId, saleId, dateStart, dateEnd]
            );

            expect(result).toEqual(historyResult);
        });

        it("should return an empty array if there is no history", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await historyAdmin(
                userId,
                saleId,
                dateStart,
                dateEnd
            );

            expect(result).toEqual([]);
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                historyAdmin(userId, saleId, dateStart, dateEnd)
            ).rejects.toBe(error);
        });
    });

    describe("historyOwner", () => {
        it("should get owner history successfully", async () => {
            vi.mocked(myDb.query).mockResolvedValue([historyResult] as any);

            const result = await historyOwner(
                userId,
                saleId,
                dateStart,
                dateEnd
            );

            expect(myDb.query).toHaveBeenCalledWith(
                expect.stringContaining("u.company_id"),
                [userId, saleId, dateStart, dateEnd]
            );

            expect(result).toEqual(historyResult);
        });

        it("should return an empty array if there is no history", async () => {
            vi.mocked(myDb.query).mockResolvedValue([[]] as any);

            const result = await historyOwner(
                userId,
                saleId,
                dateStart,
                dateEnd
            );

            expect(result).toEqual([]);
        });

        it("should propagate database errors", async () => {
            const error = new Error("database error");

            vi.mocked(myDb.query).mockRejectedValue(error);

            await expect(
                historyOwner(userId, saleId, dateStart, dateEnd)
            ).rejects.toBe(error);
        });
    });
});