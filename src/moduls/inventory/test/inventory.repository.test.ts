import { beforeEach, describe, expect, it, vi } from "vitest";
import { myDb } from "../../helper/pool";
import {
    inventoryRepositoryAdmin,
    inventoryRepositoryCashier,
    inventoryRepositoryOwner
} from "./inventory.repository";

vi.mock("../../helper/pool", () => ({
    myDb: {
        query: vi.fn()
    }
}));

describe("Repository inventoryRepositoryOwner GET /inventory", () => {
    const inventoryResult = [
        {
            id: 1,
            name: "Apple",
            image_url: "apple.jpg"
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should get company products successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([inventoryResult] as any);

        const result = await inventoryRepositoryOwner(1, "%Apple%");

        expect(myDb.query).toHaveBeenCalledWith(
            expect.stringContaining("where company_id=?"),
            [1, "%Apple%"]
        );

        expect(result).toEqual(inventoryResult);
    });

    it("should return an empty array if there are no products", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[]] as any);

        const result = await inventoryRepositoryOwner(1, "%Unknown%");

        expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            inventoryRepositoryOwner(1, "%Apple%")
        ).rejects.toBe(error);
    });
});

describe("Repository inventoryRepositoryAdmin GET /inventory", () => {
    const inventoryResult = [
        {
            id: 1,
            name: "Apple",
            image_url: "apple.jpg",
            branch_product_id: 1,
            stock: 10,
            minStock: 2,
            boughtPriceProduct: 100,
            sellPriceProduct: 150,
            branch_id: 1,
            is_in_branch: 1
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should get company products with branch inventory successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([inventoryResult] as any);

        const result = await inventoryRepositoryAdmin(
            2,
            "%Apple%",
            "desc",
            "asc"
        );

        expect(myDb.query).toHaveBeenCalledWith(
            expect.stringContaining("LEFT JOIN branch_products bp"),
            [2, 2, "%Apple%", "asc", "asc", "desc", "desc"]
        );

        expect(result).toEqual(inventoryResult);
    });

    it("should return an empty array if there are no products", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[]] as any);

        const result = await inventoryRepositoryAdmin(
            2,
            "%Unknown%",
            "",
            ""
        );

        expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            inventoryRepositoryAdmin(2, "%Apple%", "desc", "asc")
        ).rejects.toBe(error);
    });
});

describe("Repository inventoryRepositoryCashier GET /inventory", () => {
    const inventoryResult = [
        {
            id: 1,
            name: "Apple",
            image_url: "apple.jpg",
            sellPriceProduct: 150,
            stock: 10
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should get branch products successfully", async () => {
        vi.mocked(myDb.query).mockResolvedValue([inventoryResult] as any);

        const result = await inventoryRepositoryCashier("%Apple%", 3);

        expect(myDb.query).toHaveBeenCalledWith(
            expect.stringContaining("bp.branch_id = (select branch_id"),
            ["%Apple%", 3]
        );

        expect(result).toEqual(inventoryResult);
    });

    it("should return an empty array if there are no branch products", async () => {
        vi.mocked(myDb.query).mockResolvedValue([[]] as any);

        const result = await inventoryRepositoryCashier("%Unknown%", 3);

        expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
        const error = new Error("database error");

        vi.mocked(myDb.query).mockRejectedValue(error);

        await expect(
            inventoryRepositoryCashier("%Apple%", 3)
        ).rejects.toBe(error);
    });
});