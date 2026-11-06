import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../helper/pool";
import { newSaleRepository } from "./new_sale.repository";

vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository newSaleRepository POST /sale", () => {
    const placeholder = "(@saleId, ?, ?, ?), (@saleId, ?, ?, ?)";

    const values = [
        1, 150, 2,
        2, 250, 1
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a sale and its product details successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([{}] as any);

        await newSaleRepository(
            3,
            550,
            "2026-11-5",
            600,
            placeholder,
            values
        );

        expect(myDb.query).toHaveBeenCalledWith(
            expect.stringContaining("start transaction"),
            [
                3,
                3,
                550,
                "2026-11-5",
                600,
                ...values
            ]
        );

        expect(myDb.query).toHaveBeenCalledTimes(1);
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            newSaleRepository(
                3,
                550,
                "2026-11-5",
                600,
                placeholder,
                values
            )
        ).rejects.toBe(error);
    });
});