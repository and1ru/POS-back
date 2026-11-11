import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NewSaleService } from "../new_sale.service";
import type { productType } from "../new_sale.schema";
import { newSaleRepository } from "../new_sale.repository";

vi.mock("../new_sale.repository", () => ({
    newSaleRepository: vi.fn()
}));

describe("Service newSale POST /sale", () => {
    let service: NewSaleService;

    const products: productType[] = [
        { id: 1, price: 150, quantity: 2 },
        { id: 2, price: 250, quantity: 1 }
    ];

    const userId = 3;
    const amountReceived = 600;

    beforeEach(() => {
        vi.clearAllMocks();

        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-05T12:00:00"));

        service = new NewSaleService();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should calculate the total and create a sale successfully", async () => {
        vi.mocked(newSaleRepository).mockResolvedValue(undefined);

        await service.newSale(
            products,
            userId,
            amountReceived
        );

        expect(newSaleRepository).toHaveBeenCalledWith(
            userId,
            550,
            "2026-11-5",
            amountReceived,
            "(@saleId, ?, ?, ?), (@saleId, ?, ?, ?)",
            [1, 150, 2, 2, 250, 1]
        );
    });

    it("should calculate the total correctly with decimal prices", async () => {
        vi.mocked(newSaleRepository).mockResolvedValue(undefined);

        await service.newSale(
            [
                { id: 1, price: 150.5, quantity: 2 },
                { id: 2, price: 200.25, quantity: 1 }
            ],
            userId,
            600
        );

        expect(newSaleRepository).toHaveBeenCalledWith(
            userId,
            501.25,
            "2026-11-5",
            600,
            "(@saleId, ?, ?, ?), (@saleId, ?, ?, ?)",
            [1, 150.5, 2, 2, 200.25, 1]
        );
    });

    it("should propagate repository errors", async () => {
        const error = new Error("repository error");

        vi.mocked(newSaleRepository).mockRejectedValue(error);

        await expect(
            service.newSale(products, userId, amountReceived)
        ).rejects.toBe(error);
    });
});