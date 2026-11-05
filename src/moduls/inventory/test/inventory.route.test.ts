import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";
import { myDb } from "../../helper/pool";
import { generateTokenTest, tokenTest } from "../helpers/tokenTest";

describe("Route GET /inventory", () => {
    const ownerToken = generateTokenTest(1, "owner", 1);
    const adminToken = generateTokenTest(2, "admin", 1);
    const cashierToken = generateTokenTest(3, "cashier", 1);

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (id, name, date)
            VALUES
                (1, 'Company One', '2026-11-05'),
                (2, 'Company Two', '2026-11-05');

            INSERT INTO branches (id, name, address, city, company_id)
            VALUES
                (1, 'Branch One', 'Address One', 'Medellin', 1),
                (2, 'Branch Two', 'Address Two', 'Medellin', 1),
                (3, 'Branch Three', 'Address Three', 'Bogota', 2);

            INSERT INTO users (id, name, email, password, role, company_id)
            VALUES
                (1, 'Owner One', 'owner@test.com', 'password', 'owner', 1),
                (2, 'Admin One', 'admin@test.com', 'password', 'admin', 1),
                (3, 'Cashier One', 'cashier@test.com', 'password', 'cashier', 1),
                (4, 'Root One', 'root@test.com', 'password', 'root', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-05', 2000),
                (3, 1, '2026-11-05', 1500);

            INSERT INTO products (id, name, image_url, company_id)
            VALUES
                (1, 'Apple', 'apple.jpg', 1),
                (2, 'Banana', 'banana.jpg', 1),
                (3, 'Orange', 'orange.jpg', 1),
                (4, 'Apple Juice', 'apple-juice.jpg', 1),
                (5, 'Apple Other', 'apple-other.jpg', 2);

            INSERT INTO branch_products
                (product_id, branch_id, stock, minStock, boughtPriceProduct, sellPriceProduct)
            VALUES
                (1, 1, 10, 2, 100, 150),
                (2, 1, 3, 1, 200, 250),
                (3, 2, 20, 5, 300, 350),
                (5, 3, 99, 10, 400, 450);

            COMMIT;
        `);
    });

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE branch_products;
            TRUNCATE TABLE employees;
            TRUNCATE TABLE products;
            TRUNCATE TABLE users;
            TRUNCATE TABLE branches;
            TRUNCATE TABLE companies;

            SET FOREIGN_KEY_CHECKS = 1;
        `);
    });

    describe("successful requests", () => {
        it("should allow an owner to get products from their company", async () => {
            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                message: "got products",
                success: true
            });

            expect(response.body.result).toHaveLength(4);

            expect(
                response.body.result.map((product: any) => product.id).sort(
                    (a: number, b: number) => a - b
                )
            ).toEqual([1, 2, 3, 4]);
        });

        it("should allow an owner to filter products by name", async () => {
            const response = await request(app)
                .get("/inventory")
                .query({
                    productName: "Apple"
                })
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(response.status).toBe(200);

            expect(response.body.result).toHaveLength(2);

            expect(response.body.result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 1,
                        name: "Apple"
                    }),
                    expect.objectContaining({
                        id: 4,
                        name: "Apple Juice"
                    })
                ])
            );
        });

        it("should allow an admin to get all company products with their branch inventory", async () => {
            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                message: "got products",
                success: true
            });

            expect(response.body.result).toHaveLength(4);

            const apple = response.body.result.find(
                (product: any) => product.id === 1
            );

            expect(apple).toMatchObject({
                name: "Apple",
                branch_product_id: 1,
                stock: 10,
                minStock: 2,
                branch_id: 1
            });

            const orange = response.body.result.find(
                (product: any) => product.id === 3
            );

            expect(orange.branch_product_id).toBeNull();
            expect(Number(orange.is_in_branch)).toBe(0);
        });

        it("should allow an admin to sort products by stock descending", async () => {
            const response = await request(app)
                .get("/inventory")
                .query({
                    stock: "desc"
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.slice(0, 2).map(
                    (product: any) => product.id
                )
            ).toEqual([1, 2]);
        });

        it("should allow an admin to sort products by price descending", async () => {
            const response = await request(app)
                .get("/inventory")
                .query({
                    price: "desc"
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.slice(0, 2).map(
                    (product: any) => product.id
                )
            ).toEqual([2, 1]);
        });

        it("should allow a cashier to get products from their own branch", async () => {
            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                message: "got products",
                success: true
            });

            expect(response.body.result).toHaveLength(2);

            expect(
                response.body.result.map((product: any) => product.id).sort(
                    (a: number, b: number) => a - b
                )
            ).toEqual([1, 2]);
        });

        it("should allow a cashier to filter branch products by name", async () => {
            const response = await request(app)
                .get("/inventory")
                .query({
                    productName: "Banana"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);
            expect(response.body.result).toHaveLength(1);
            expect(response.body.result[0]).toMatchObject({
                id: 2,
                name: "Banana",
                stock: 3
            });
        });
    });

    describe("data isolation", () => {
        it("should not return products from another company to an owner", async () => {
            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((product: any) => product.id === 5)
            ).toBe(false);
        });

        it("should not return products from another company to an admin", async () => {
            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((product: any) => product.id === 5)
            ).toBe(false);
        });

        it("should not return products from another branch to a cashier", async () => {
            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((product: any) => product.id === 3)
            ).toBe(false);
        });
    });

    describe("empty results", () => {
        it("should return an empty array if the product name does not exist", async () => {
            const response = await request(app)
                .get("/inventory")
                .query({
                    productName: "Unknown Product"
                })
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.result).toEqual([]);
        });
    });

    describe("invalid query parameters", () => {
        it.each([
            "productName",
            "price",
            "stock"
        ] as const)("should return 400 if %s is repeated", async (parameter) => {
            const response = await request(app)
                .get(`/inventory?${parameter}=value1&${parameter}=value2`)
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "",
                success: false
            });
        });
    });

    describe("role authorization", () => {
        it("should return 403 for root", async () => {
            const rootToken = generateTokenTest(4, "root", 1);

            const response = await request(app)
                .get("/inventory")
                .set("Authorization", `Bearer ${rootToken}`);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/inventory", "get");
});