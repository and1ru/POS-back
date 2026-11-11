import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { myDb } from "../../../helper/pool";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";

describe("Route POST /sale", () => {
    const cashierToken = generateTokenTest(1, "cashier", 1);

    const validBody = {
        amountReceived: 600,
        products: [
            { id: 1, price: 150, quantity: 2 },
            { id: 2, price: 250, quantity: 1 }
        ]
    };

    const invalidBodies = [
        {
            label: "amountReceived is a string",
            body: { ...validBody, amountReceived: "600" }
        },
        {
            label: "amountReceived is zero",
            body: { ...validBody, amountReceived: 0 }
        },
        {
            label: "amountReceived is negative",
            body: { ...validBody, amountReceived: -100 }
        },
        {
            label: "amountReceived is missing",
            body: (() => {
                const { amountReceived, ...body } = validBody;
                return body;
            })()
        },
        {
            label: "products is not an array",
            body: { ...validBody, products: "invalid" }
        },
        {
            label: "products is empty",
            body: { ...validBody, products: [] }
        },
        {
            label: "products is missing",
            body: (() => {
                const { products, ...body } = validBody;
                return body;
            })()
        },
        {
            label: "product price is a string",
            body: {
                ...validBody,
                products: [{ id: 1, price: "150", quantity: 2 }]
            }
        },
        {
            label: "product price is zero",
            body: {
                ...validBody,
                products: [{ id: 1, price: 0, quantity: 2 }]
            }
        },
        {
            label: "product price is negative",
            body: {
                ...validBody,
                products: [{ id: 1, price: -150, quantity: 2 }]
            }
        },
        {
            label: "product price is missing",
            body: {
                ...validBody,
                products: [{ id: 1, quantity: 2 }]
            }
        },
        {
            label: "product quantity is a string",
            body: {
                ...validBody,
                products: [{ id: 1, price: 150, quantity: "2" }]
            }
        },
        {
            label: "product quantity is zero",
            body: {
                ...validBody,
                products: [{ id: 1, price: 150, quantity: 0 }]
            }
        },
        {
            label: "product quantity is negative",
            body: {
                ...validBody,
                products: [{ id: 1, price: 150, quantity: -2 }]
            }
        },
        {
            label: "product quantity is decimal",
            body: {
                ...validBody,
                products: [{ id: 1, price: 150, quantity: 1.5 }]
            }
        },
        {
            label: "product quantity is missing",
            body: {
                ...validBody,
                products: [{ id: 1, price: 150 }]
            }
        },
        {
            label: "product ID is a string",
            body: {
                ...validBody,
                products: [{ id: "1", price: 150, quantity: 2 }]
            }
        },
        {
            label: "product ID is zero",
            body: {
                ...validBody,
                products: [{ id: 0, price: 150, quantity: 2 }]
            }
        },
        {
            label: "product ID is negative",
            body: {
                ...validBody,
                products: [{ id: -1, price: 150, quantity: 2 }]
            }
        },
        {
            label: "product ID is decimal",
            body: {
                ...validBody,
                products: [{ id: 1.5, price: 150, quantity: 2 }]
            }
        },
        {
            label: "product ID is missing",
            body: {
                ...validBody,
                products: [{ price: 150, quantity: 2 }]
            }
        }
    ];

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
                (1, 'Cashier One', 'cashier@test.com', 'password', 'cashier', 1),
                (2, 'Owner One', 'owner@test.com', 'password', 'owner', 1),
                (3, 'Admin One', 'admin@test.com', 'password', 'admin', 1),
                (4, 'Root One', 'root@test.com', 'password', 'root', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (1, 1, '2026-11-05', 1500),
                (3, 1, '2026-11-05', 2000);

            INSERT INTO products (id, name, image_url, company_id)
            VALUES
                (1, 'Apple', 'apple.jpg', 1),
                (2, 'Banana', 'banana.jpg', 1),
                (3, 'Orange', 'orange.jpg', 1),
                (4, 'Other Product', 'other.jpg', 2);

            INSERT INTO branch_products
                (id, product_id, branch_id, stock, minStock, boughtPriceProduct, sellPriceProduct)
            VALUES
                (1, 1, 1, 10, 2, 100, 150),
                (2, 2, 1, 5, 1, 200, 250),
                (3, 3, 2, 20, 5, 300, 350),
                (4, 4, 3, 30, 5, 400, 450);

            COMMIT;
        `);
    });

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE sale_product;
            TRUNCATE TABLE sales;
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
        it("should create a sale and decrease the stock successfully", async () => {
            const response = await request(app)
                .post("/sale")
                .set("Authorization", `Bearer ${cashierToken}`)
                .send(validBody);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "new sale was created",
                success: true
            });

            const [sales] = await myDb.query(
                `
                    SELECT
                        id,
                        user_id,
                        total_price,
                        branch_id,
                        amountReceived
                    FROM sales
                    WHERE user_id = ?
                `,
                [1]
            ) as any;

            expect(sales).toHaveLength(1);
            expect(sales[0].user_id).toBe(1);
            expect(Number(sales[0].total_price)).toBe(550);
            expect(Number(sales[0].branch_id)).toBe(1);
            expect(Number(sales[0].amountReceived)).toBe(600);

            const [saleProducts] = await myDb.query(
                `
                    SELECT branch_product_id, price, quantity
                    FROM sale_product
                    WHERE sale_id = ?
                    ORDER BY branch_product_id
                `,
                [sales[0].id]
            ) as any;

            expect(saleProducts.map((product: any) => ({
                branch_product_id: Number(product.branch_product_id),
                price: Number(product.price),
                quantity: Number(product.quantity)
            }))).toEqual([
                {
                    branch_product_id: 1,
                    price: 150,
                    quantity: 2
                },
                {
                    branch_product_id: 2,
                    price: 250,
                    quantity: 1
                }
            ]);

            const [stockRows] = await myDb.query(
                `
                    SELECT id, stock
                    FROM branch_products
                    WHERE id IN (1, 2)
                    ORDER BY id
                `
            ) as any;

            expect(stockRows.map((product: any) => ({
                id: Number(product.id),
                stock: Number(product.stock)
            }))).toEqual([
                { id: 1, stock: 8 },
                { id: 2, stock: 4 }
            ]);
        });
    });

    describe("stock validation", () => {
        it("should reject a sale if there is insufficient stock and not create the sale", async () => {
            const response = await request(app)
                .post("/sale")
                .set("Authorization", `Bearer ${cashierToken}`)
                .send({
                    amountReceived: 1500,
                    products: [
                        { id: 2, price: 250, quantity: 6 }
                    ]
                });

            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);

            const [sales] = await myDb.query(
                "SELECT id FROM sales WHERE user_id = ?",
                [1]
            ) as any;

            expect(sales).toHaveLength(0);

            const [stockRows] = await myDb.query(
                "SELECT stock FROM branch_products WHERE id = ?",
                [2]
            ) as any;

            expect(Number(stockRows[0].stock)).toBe(5);
        });

        it("should not allow a cashier to sell a product from another branch", async () => {
            const response = await request(app)
                .post("/sale")
                .set("Authorization", `Bearer ${cashierToken}`)
                .send({
                    amountReceived: 350,
                    products: [
                        { id: 3, price: 350, quantity: 1 }
                    ]
                });

            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.status).toBeLessThan(500);

            const [sales] = await myDb.query(
                "SELECT id FROM sales WHERE user_id = ?",
                [1]
            ) as any;

            expect(sales).toHaveLength(0);

            const [stockRows] = await myDb.query(
                "SELECT stock FROM branch_products WHERE id = ?",
                [3]
            ) as any;

            expect(Number(stockRows[0].stock)).toBe(20);
        });
    });

    describe("price validation", () => {
        it("should not trust a price sent by the client", async () => {
            const response = await request(app)
                .post("/sale")
                .set("Authorization", `Bearer ${cashierToken}`)
                .send({
                    amountReceived: 300,
                    products: [
                        { id: 1, price: 1, quantity: 2 }
                    ]
                });

            if (response.status === 201) {
                const [sales] = await myDb.query(
                    "SELECT id, total_price FROM sales WHERE user_id = ?",
                    [1]
                ) as any;

                expect(sales).toHaveLength(1);
                expect(Number(sales[0].total_price)).toBe(300);

                const [saleProducts] = await myDb.query(
                    "SELECT price FROM sale_product WHERE sale_id = ?",
                    [sales[0].id]
                ) as any;

                expect(Number(saleProducts[0].price)).toBe(150);
            } else {
                expect([400, 409]).toContain(response.status);

                const [sales] = await myDb.query(
                    "SELECT id FROM sales WHERE user_id = ?",
                    [1]
                ) as any;

                expect(sales).toHaveLength(0);
            }
        });
    });

    describe("schema validation", () => {
        it.each(invalidBodies)(
            "should return 400 when $label",
            async ({ body }) => {
                const response = await request(app)
                    .post("/sale")
                    .set("Authorization", `Bearer ${cashierToken}`)
                    .send(body);

                expect(response.status).toBe(400);
            }
        );
    });

    describe("role authorization", () => {
        it.each([
            { userId: 2, role: "owner" as const },
            { userId: 3, role: "admin" as const },
            { userId: 4, role: "root" as const }
        ])("should return 403 for role $role", async ({ userId, role }) => {
            const token = generateTokenTest(userId, role, 1);

            const response = await request(app)
                .post("/sale")
                .set("Authorization", `Bearer ${token}`)
                .send(validBody);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/sale", "post");
});