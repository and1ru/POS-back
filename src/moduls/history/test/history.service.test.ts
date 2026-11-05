import { beforeEach, describe, expect, it, vi } from "vitest";
import { HistoryService } from "../history.service";
import { timeHelper } from "../../../helper/time";
import { historyAdmin, historyCashier, historyOwner } from "../history.repository";

vi.mock("../../helper/time", () => ({
    timeHelper: vi.fn()
}));

vi.mock("./history.repository", () => ({
    historyAdmin: vi.fn(),
    historyCashier: vi.fn(),
    historyOwner: vi.fn()
}));

describe("Service GET /history", () => {
    let service: HistoryService;

    const userId = 3;
    const saleDate = "today";
    const saleId = "15";

    const dateStart = "2026-11-04 00:00:00";
    const dateEnd = "2026-11-05 00:00:00";

    const historyResult = [
        {
            id: 15,
            total_price: 50000,
            date: "2026-11-04 10:00:00",
            quantity: 3,
            products: 2
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        service = new HistoryService();

        vi.mocked(timeHelper).mockReturnValue({
            dateStart,
            dateEnd
        } as any);
    });

    describe("history as cashier", () => {
        it("should get cashier history successfully", async () => {
            vi.mocked(historyCashier).mockResolvedValue(historyResult as any);

            const result = await service.history(
                userId,
                "cashier",
                saleDate,
                saleId
            );

            expect(timeHelper).toHaveBeenCalledWith(saleDate);

            expect(historyCashier).toHaveBeenCalledWith(
                userId,
                "%15%",
                dateStart,
                dateEnd
            );

            expect(historyAdmin).not.toHaveBeenCalled();
            expect(historyOwner).not.toHaveBeenCalled();

            expect(result).toEqual(historyResult);
        });

        it("should use an empty sale ID filter when saleId is undefined", async () => {
            vi.mocked(historyCashier).mockResolvedValue(historyResult as any);

            const result = await service.history(
                userId,
                "cashier",
                saleDate,
                undefined
            );

            expect(historyCashier).toHaveBeenCalledWith(
                userId,
                "%%",
                dateStart,
                dateEnd
            );

            expect(result).toEqual(historyResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(historyCashier).mockRejectedValue(error);

            await expect(
                service.history(userId, "cashier", saleDate, saleId)
            ).rejects.toBe(error);
        });
    });

    describe("history as admin", () => {
        it("should get admin history successfully", async () => {
            vi.mocked(historyAdmin).mockResolvedValue(historyResult as any);

            const result = await service.history(
                userId,
                "admin",
                saleDate,
                saleId
            );

            expect(timeHelper).toHaveBeenCalledWith(saleDate);

            expect(historyAdmin).toHaveBeenCalledWith(
                userId,
                "%15%",
                dateStart,
                dateEnd
            );

            expect(historyCashier).not.toHaveBeenCalled();
            expect(historyOwner).not.toHaveBeenCalled();

            expect(result).toEqual(historyResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(historyAdmin).mockRejectedValue(error);

            await expect(
                service.history(userId, "admin", saleDate, saleId)
            ).rejects.toBe(error);
        });
    });

    describe("history as owner", () => {
        it("should get owner history successfully", async () => {
            vi.mocked(historyOwner).mockResolvedValue(historyResult as any);

            const result = await service.history(
                userId,
                "owner",
                saleDate,
                saleId
            );

            expect(timeHelper).toHaveBeenCalledWith(saleDate);

            expect(historyOwner).toHaveBeenCalledWith(
                userId,
                "%15%",
                dateStart,
                dateEnd
            );

            expect(historyCashier).not.toHaveBeenCalled();
            expect(historyAdmin).not.toHaveBeenCalled();

            expect(result).toEqual(historyResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(historyOwner).mockRejectedValue(error);

            await expect(
                service.history(userId, "owner", saleDate, saleId)
            ).rejects.toBe(error);
        });
    });

    it("should return undefined for an unsupported role", async () => {
        const result = await service.history(
            userId,
            "root",
            saleDate,
            saleId
        );

        expect(result).toBeUndefined();

        expect(historyCashier).not.toHaveBeenCalled();
        expect(historyAdmin).not.toHaveBeenCalled();
        expect(historyOwner).not.toHaveBeenCalled();
    });
});