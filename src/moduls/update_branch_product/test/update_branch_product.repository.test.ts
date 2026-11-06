import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../helper/pool";
import {
    findBranchProductById,
    updatedBranchProduct
} from "./update_branch_product.repository";

vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository findBranchProductById PUT /branch-product", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should find a branch product successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[{ id: 1 }]] as any);

        const result = await findBranchProductById(1);

        expect(myDb.query).toHaveBeenCalledWith(
            "SELECT id from branch_products WHERE id=?",
            [1]
        );

        expect(result).toEqual({ id: 1 });
    });

    it("should return undefined if the branch product does not exist", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[]] as any);

        const result = await findBranchProductById(999);

        expect(result).toBeUndefined();
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            findBranchProductById(1)
        ).rejects.toBe(error);
    });
});

describe("Repository updatedBranchProduct PUT /branch-product", () => {
    const productData = {
        boughtPriceProduct: 100,
        currentStock: 20,
        minStock: 5,
        productId: 1,
        sellPriceProduct: 150,
        userId: 2
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should update a branch product successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([{}] as any);

        await updatedBranchProduct(
            productData.boughtPriceProduct,
            productData.currentStock,
            productData.minStock,
            productData.productId,
            productData.sellPriceProduct,
            productData.userId
        );

        expect(myDb.query).toHaveBeenCalledWith(
            expect.stringContaining("where id = ? AND branch_id"),
            [
                productData.currentStock,
                productData.minStock,
                productData.boughtPriceProduct,
                productData.sellPriceProduct,
                productData.productId,
                productData.userId
            ]
        );
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            updatedBranchProduct(
                productData.boughtPriceProduct,
                productData.currentStock,
                productData.minStock,
                productData.productId,
                productData.sellPriceProduct,
                productData.userId
            )
        ).rejects.toBe(error);
    });
});