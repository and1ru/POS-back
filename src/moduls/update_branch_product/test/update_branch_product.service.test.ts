import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    findBranchProductById,
    updatedBranchProduct
} from "./update_branch_product.repository";
import { UpdateProductService } from "./update_branch_product.service";

vi.mock("./update_branch_product.repository", () => ({
    findBranchProductById: vi.fn(),
    updatedBranchProduct: vi.fn()
}));

describe("Service updateProduct PUT /branch-product", () => {
    let service: UpdateProductService;

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

        service = new UpdateProductService();
    });

    it("should update a branch product successfully", async () => {
        vi.mocked(findBranchProductById).mockResolvedValue({ id: 1 } as any);
        vi.mocked(updatedBranchProduct).mockResolvedValue(undefined);

        await service.updateProduct(
            productData.boughtPriceProduct,
            productData.currentStock,
            productData.minStock,
            productData.productId,
            productData.sellPriceProduct,
            productData.userId
        );

        expect(findBranchProductById).toHaveBeenCalledWith(
            productData.productId
        );

        expect(updatedBranchProduct).toHaveBeenCalledWith(
            productData.boughtPriceProduct,
            productData.currentStock,
            productData.minStock,
            productData.productId,
            productData.sellPriceProduct,
            productData.userId
        );
    });

    it("should throw an error if the branch product does not exist", async () => {
        vi.mocked(findBranchProductById).mockResolvedValue(undefined as any);

        await expect(
            service.updateProduct(
                productData.boughtPriceProduct,
                productData.currentStock,
                productData.minStock,
                productData.productId,
                productData.sellPriceProduct,
                productData.userId
            )
        ).rejects.toThrow("no product branch");

        expect(updatedBranchProduct).not.toHaveBeenCalled();
    });

    it("should propagate errors from findBranchProductById", async () => {
        const error = new Error("database error");

        vi.mocked(findBranchProductById).mockRejectedValue(error);

        await expect(
            service.updateProduct(
                productData.boughtPriceProduct,
                productData.currentStock,
                productData.minStock,
                productData.productId,
                productData.sellPriceProduct,
                productData.userId
            )
        ).rejects.toBe(error);

        expect(updatedBranchProduct).not.toHaveBeenCalled();
    });

    it("should propagate errors from updatedBranchProduct", async () => {
        const error = new Error("update error");

        vi.mocked(findBranchProductById).mockResolvedValue({ id: 1 } as any);
        vi.mocked(updatedBranchProduct).mockRejectedValue(error);

        await expect(
            service.updateProduct(
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