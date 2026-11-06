import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";
import { myDb } from "../../helper/pool";
import { generateTokenTest, tokenTest } from "../helpers/tokenTest";

describe("Route PUT /branch-product", () => {
    const adminToken = generateTokenTest(1, "admin", 1);

    const validBody = {
        boughtPriceProduct: 120,
        currentStock: 20,
        minStock: 5,
        productId: 1,
        sellPriceProduct: 180
    };

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
                (1, 'Admin One', 'admin@test.com', 'password', 'admin', 1),
                (2, 'Owner One', 'owner@test.com', 'password', 'owner', 1),
                (3, 'Cashier One', 'cashier@test.com', 'password', 'cashier', 1),
                (4, 'Root One', 'root@test.com', 'password', 'root', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (1, 1, '2026-11-05', 2000),
                (3, 1, '2026-11-05', 1500);

            INSERT INTO products (id, name, image_url, company_id)
            VALUES
                (1, 'Apple', 'apple.jpg', 1),
                (2, 'Banana', 'banana.jpg', 1),
                (3, 'Orange', 'orange.jpg', 2);

            INSERT INTO branch_products
                (id, product_id, branch_id, stock, minStock, boughtPriceProduct, sellPriceProduct)
            VALUES
                (1, 1, 1, 10, 2, 100, 150),
                (2, 2, 2, 15, 3, 200, 250),
                (3, 3, 3, 20, 4, 300, 350);

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
        it("should update a product from the admin branch", async () => {
            const response = await request(app)
                .put("/branch-product")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(validBody);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "product updated",
                success: true
            });

            const [result] = await myDb.query(
                `
                    SELECT
                        stock,
                        minStock,
                        boughtPriceProduct,
                        sellPriceProduct
                    FROM branch_products
                    WHERE id = ?
                `,
                [1]
            ) as any;

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                stock: 20,
                minStock: 5
            });

            expect(Number(result[0].boughtPriceProduct)).toBe(120);
            expect(Number(result[0].sellPriceProduct)).toBe(180);
        });

        it("should accept decimal values for product prices", async () => {
            const response = await request(app)
                .put("/branch-product")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...validBody,
                    boughtPriceProduct: 120.5,
                    sellPriceProduct: 180.75
                });

            expect(response.status).toBe(200);

            const [result] = await myDb.query(
                `
                    SELECT boughtPriceProduct, sellPriceProduct
                    FROM branch_products
                    WHERE id = ?
                `,
                [1]
            ) as any;

            expect(Number(result[0].boughtPriceProduct)).toBe(120.5);
            expect(Number(result[0].sellPriceProduct)).toBe(180.75);
        });
    });

    describe("product existence and branch isolation", () => {
        it("should return 404 if the branch product does not exist", async () => {
            const response = await request(app)
                .put("/branch-product")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...validBody,
                    productId: 999
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("no product branch");
        });

        it("should not update a product from another branch", async () => {
            const response = await request(app)
                .put("/branch-product")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...validBody,
                    productId: 2
                });

            expect(response.status).toBe(404);

            const [result] = await myDb.query(
                `
                    SELECT
                        stock,
                        minStock,
                        boughtPriceProduct,
                        sellPriceProduct
                    FROM branch_products
                    WHERE id = ?
                `,
                [2]
            ) as any;

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                stock: 15,
                minStock: 3
            });

            expect(Number(result[0].boughtPriceProduct)).toBe(200);
            expect(Number(result[0].sellPriceProduct)).toBe(250);
        });
    });

    describe("schema validation", () => {
        const invalidBodies = [
            {
                label: "minStock is a string",
                body: { ...validBody, minStock: "5" }
            },
            {
                label: "minStock is zero",
                body: { ...validBody, minStock: 0 }
            },
            {
                label: "minStock is negative",
                body: { ...validBody, minStock: -5 }
            },
            {
                label: "minStock is decimal",
                body: { ...validBody, minStock: 1.5 }
            },
            {
                label: "currentStock is a string",
                body: { ...validBody, currentStock: "20" }
            },
            {
                label: "currentStock is zero",
                body: { ...validBody, currentStock: 0 }
            },
            {
                label: "currentStock is negative",
                body: { ...validBody, currentStock: -20 }
            },
            {
                label: "currentStock is decimal",
                body: { ...validBody, currentStock: 2.5 }
            },
            {
                label: "boughtPriceProduct is a string",
                body: { ...validBody, boughtPriceProduct: "120" }
            },
            {
                label: "boughtPriceProduct is zero",
                body: { ...validBody, boughtPriceProduct: 0 }
            },
            {
                label: "boughtPriceProduct is negative",
                body: { ...validBody, boughtPriceProduct: -120 }
            },
            {
                label: "sellPriceProduct is a string",
                body: { ...validBody, sellPriceProduct: "180" }
            },
            {
                label: "sellPriceProduct is zero",
                body: { ...validBody, sellPriceProduct: 0 }
            },
            {
                label: "sellPriceProduct is negative",
                body: { ...validBody, sellPriceProduct: -180 }
            },
            {
                label: "productId is a string",
                body: { ...validBody, productId: "1" }
            },
            {
                label: "productId is zero",
                body: { ...validBody, productId: 0 }
            },
            {
                label: "productId is negative",
                body: { ...validBody, productId: -1 }
            },
            {
                label: "productId is decimal",
                body: { ...validBody, productId: 1.5 }
            }
        ];

        it.each(invalidBodies)(
            "should return 400 if $label",
            async ({ body }) => {
                const response = await request(app)
                    .put("/branch-product")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(body);

                expect(response.status).toBe(400);
            }
        );

        it.each([
            "minStock",
            "currentStock",
            "boughtPriceProduct",
            "sellPriceProduct",
            "productId"
        ] as const)("should return 400 if %s is missing", async (field) => {
            const body = { ...validBody } as Record<string, unknown>;
            delete body[field];

            const response = await request(app)
                .put("/branch-product")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(body);

            expect(response.status).toBe(400);
        });
    });

    describe("role authorization", () => {
        it.each([
            { userId: 2, role: "owner" as const },
            { userId: 3, role: "cashier" as const },
            { userId: 4, role: "root" as const }
        ])("should return 403 for role $role", async ({ userId, role }) => {
            const token = generateTokenTest(userId, role, 1);

            const response = await request(app)
                .put("/branch-product")
                .set("Authorization", `Bearer ${token}`)
                .send(validBody);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/branch-product", "put");
});