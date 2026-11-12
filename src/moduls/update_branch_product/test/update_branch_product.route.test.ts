import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { myDb } from "../../../helper/pool";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";

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

            INSERT INTO companies (name, date)
            VALUES
                ('Company One', '2026-11-05'),
                ('Company Two', '2026-11-05');

            INSERT INTO branches (name, address, city, company_id)
            VALUES
                ('Branch One', 'Address One', 'Medellin', 1),
                ('Branch Two', 'Address Two', 'Medellin', 1),
                ('Branch Three', 'Address Three', 'Bogota', 2);

            INSERT INTO users (name, email, password, role, company_id)
            VALUES
                ('Admin One', 'admin@test.com', 'password', 'admin', 1),
                ('Admin One', 'admin2@test.com', 'password', 'admin', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (1, 1, '2026-11-05', 2000),
                (2, 2, '2026-11-05', 1500);

            INSERT INTO products (name, image_url, company_id)
            VALUES
                ('Apple', 'apple.jpg', 1),
                ('Banana', 'banana.jpg', 1),
                ('Orange', 'orange.jpg', 2);

            INSERT INTO branch_products
                (product_id, branch_id, stock, minStock, boughtPriceProduct, sellPriceProduct)
            VALUES
                (1, 1, 10, 2, 100, 150),
                (2, 2, 15, 3, 200, 250),
                (3, 3, 20, 4, 300, 350);

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
                .set("Cookie", adminToken)
                .send(validBody);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "product updated",
                success: true
            });
        });

        it("should accept decimal values for product prices", async () => {
            const response = await request(app)
                .put("/branch-product")
                .set("Cookie", adminToken)
                .send({
                    ...validBody,
                    boughtPriceProduct: 120.5,
                    sellPriceProduct: 180.75
                });

            expect(response.status).toBe(200);
        });
    });

    describe("product existence and branch isolation", () => {
        it("should return 404 if the branch product does not exist", async () => {
            const response = await request(app)
                .put("/branch-product")
                .set("Cookie", adminToken)
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
                .set("Cookie", adminToken)
                .send({
                    ...validBody,
                    productId: 2
                });

            expect(response.status).toBe(404);
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
            "should return 400 if label",
            async ({ body }) => {
                const response = await request(app)
                    .put("/branch-product")
                    .set("Cookie", adminToken)
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
                .set("Cookie", adminToken)
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
                .set("Cookie", token)
                .send(validBody);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/branch-product", "put");
});