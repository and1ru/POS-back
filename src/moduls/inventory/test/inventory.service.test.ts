import { beforeEach, describe, expect, it, vi } from "vitest";
import { InventoryService } from "../inventory.service";
import { inventoryRepositoryAdmin, inventoryRepositoryCashier, inventoryRepositoryOwner } from "../inventory.repository";


vi.mock("../inventory.repository", () => ({
    inventoryRepositoryAdmin: vi.fn(),
    inventoryRepositoryCashier: vi.fn(),
    inventoryRepositoryOwner: vi.fn()
}));

describe("Service intentory GET /inventory", () => {
    let service: InventoryService;

    const inventoryResult = [
        {
            id: 1,
            name: "Apple",
            image_url: "apple.jpg"
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        service = new InventoryService();
    });

    describe("owner", () => {
        it("should get company products filtering by name", async () => {
            vi.mocked(inventoryRepositoryOwner).mockResolvedValue(inventoryResult as any);

            const result = await service.intentory(
                "owner",
                1,
                1,
                "Apple",
                "desc",
                "asc"
            );

            expect(inventoryRepositoryOwner).toHaveBeenCalledWith(
                1,
                "%Apple%"
            );

            expect(inventoryRepositoryAdmin).not.toHaveBeenCalled();
            expect(inventoryRepositoryCashier).not.toHaveBeenCalled();

            expect(result).toEqual(inventoryResult);
        });

        it("should return all company products if productName is undefined", async () => {
            vi.mocked(inventoryRepositoryOwner).mockResolvedValue(inventoryResult as any);

            const result = await service.intentory(
                "owner",
                1,
                1,
                undefined,
                undefined,
                undefined
            );

            expect(inventoryRepositoryOwner).toHaveBeenCalledWith(
                1,
                "%%"
            );

            expect(result).toEqual(inventoryResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(inventoryRepositoryOwner).mockRejectedValue(error);

            await expect(
                service.intentory(
                    "owner",
                    1,
                    1,
                    "Apple",
                    undefined,
                    undefined
                )
            ).rejects.toBe(error);
        });
    });

    describe("admin", () => {
        it("should get branch inventory with the provided filters", async () => {
            vi.mocked(inventoryRepositoryAdmin).mockResolvedValue(inventoryResult as any);

            const result = await service.intentory(
                "admin",
                1,
                2,
                "Apple",
                "desc",
                "asc"
            );

            expect(inventoryRepositoryAdmin).toHaveBeenCalledWith(
                2,
                "%Apple%",
                "desc",
                "asc"
            );

            expect(inventoryRepositoryOwner).not.toHaveBeenCalled();
            expect(inventoryRepositoryCashier).not.toHaveBeenCalled();

            expect(result).toEqual(inventoryResult);
        });

        it("should use default values if optional filters are undefined", async () => {
            vi.mocked(inventoryRepositoryAdmin).mockResolvedValue(inventoryResult as any);

            const result = await service.intentory(
                "admin",
                1,
                2,
                undefined,
                undefined,
                undefined
            );

            expect(inventoryRepositoryAdmin).toHaveBeenCalledWith(
                2,
                "%%",
                "",
                ""
            );

            expect(result).toEqual(inventoryResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(inventoryRepositoryAdmin).mockRejectedValue(error);

            await expect(
                service.intentory(
                    "admin",
                    1,
                    2,
                    "Apple",
                    "desc",
                    "asc"
                )
            ).rejects.toBe(error);
        });
    });

    describe("cashier", () => {
        it("should get products from the cashier branch filtering by name", async () => {
            vi.mocked(inventoryRepositoryCashier).mockResolvedValue(inventoryResult as any);

            const result = await service.intentory(
                "cashier",
                1,
                3,
                "Apple",
                "desc",
                "asc"
            );

            expect(inventoryRepositoryCashier).toHaveBeenCalledWith(
                "%Apple%",
                3
            );

            expect(inventoryRepositoryOwner).not.toHaveBeenCalled();
            expect(inventoryRepositoryAdmin).not.toHaveBeenCalled();

            expect(result).toEqual(inventoryResult);
        });

        it("should return all branch products if productName is undefined", async () => {
            vi.mocked(inventoryRepositoryCashier).mockResolvedValue(inventoryResult as any);

            const result = await service.intentory(
                "cashier",
                1,
                3,
                undefined,
                undefined,
                undefined
            );

            expect(inventoryRepositoryCashier).toHaveBeenCalledWith(
                "%%",
                3
            );

            expect(result).toEqual(inventoryResult);
        });

        it("should propagate repository errors", async () => {
            const error = new Error("database error");

            vi.mocked(inventoryRepositoryCashier).mockRejectedValue(error);

            await expect(
                service.intentory(
                    "cashier",
                    1,
                    3,
                    "Apple",
                    undefined,
                    undefined
                )
            ).rejects.toBe(error);
        });
    });

    it("should return undefined for an unsupported role", async () => {
        const result = await service.intentory(
            "root",
            1,
            1,
            undefined,
            undefined,
            undefined
        );

        expect(result).toBeUndefined();

        expect(inventoryRepositoryOwner).not.toHaveBeenCalled();
        expect(inventoryRepositoryAdmin).not.toHaveBeenCalled();
        expect(inventoryRepositoryCashier).not.toHaveBeenCalled();
    });
});