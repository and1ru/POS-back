import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { timeHelper } from "../../../helper/time";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { myDb } from "../../../helper/pool";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";

describe("Route GET /history", () => {
    const { dateStart, dateEnd } = timeHelper("today");

    const ownerToken = generateTokenTest(1, "owner", 1);
    const adminToken = generateTokenTest(2, "admin", 1);
    const cashierToken = generateTokenTest(3, "cashier", 1);

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (id, name, date)
            VALUES
                (1, 'Company One', '2026-11-04'),
                (2, 'Company Two', '2026-11-04');

            INSERT INTO branches (id, name, address, city, company_id)
            VALUES
                (1, 'Branch One', 'Address One', 'Medellin', 1),
                (2, 'Branch Two', 'Address Two', 'Medellin', 1),
                (3, 'Branch Three', 'Address Three', 'Bogota', 2);

            INSERT INTO users (id, name, email, password, role, company_id)
            VALUES
                (1, 'Owner One', 'owner@test.com', 'password', 'owner', 1),
                (2, 'Admin One', 'admin@test.com', 'password', 'admin', 1),
                (3, 'Cashier One', 'cashier1@test.com', 'password', 'cashier', 1),
                (4, 'Cashier Two', 'cashier2@test.com', 'password', 'cashier', 1),
                (5, 'Cashier Other Company', 'cashier3@test.com', 'password', 'cashier', 2),
                (6, 'Root One', 'root@test.com', 'password', 'root', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-04', 2000),
                (3, 1, '2026-11-04', 1500),
                (4, 2, '2026-11-04', 1500),
                (5, 3, '2026-11-04', 1500);

            INSERT INTO sales
                (id, user_id, total_price, branch_id, date, amountReceived)
            VALUES
                (1, 3, 100, 1, ?, 100),
                (10, 3, 200, 1, ?, 200),
                (2, 4, 300, 2, ?, 300),
                (3, 5, 400, 3, ?, 400),
                (4, 3, 50, 1, DATE_SUB(?, INTERVAL 1 SECOND), 50),
                (5, 3, 60, 1, ?, 60);

            COMMIT;
        `, [
            dateStart,
            dateStart,
            dateStart,
            dateStart,
            dateStart,
            dateEnd
        ]);
    });

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE sale_product;
            TRUNCATE TABLE sales;
            TRUNCATE TABLE employees;
            TRUNCATE TABLE users;
            TRUNCATE TABLE branches;
            TRUNCATE TABLE companies;

            SET FOREIGN_KEY_CHECKS = 1;
        `);
    });

    describe("successful requests", () => {
        it("should allow a cashier to get their own sales history", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("got sales history");
            expect(response.body.success).toBe(true);

            expect(response.body.result).toHaveLength(2);

            expect(
                response.body.result.map((sale: any) => sale.id).sort(
                    (a: number, b: number) => a - b
                )
            ).toEqual([1, 10]);
        });

        it("should allow an admin to get sales history from their branch", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("got sales history");
            expect(response.body.success).toBe(true);

            expect(
                response.body.result.map((sale: any) => sale.id).sort(
                    (a: number, b: number) => a - b
                )
            ).toEqual([1, 10]);
        });

        it("should allow an owner to request their company history", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${ownerToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("got sales history");
            expect(response.body.success).toBe(true);
            expect(response.body.result).toEqual([]);
        });
    });

    describe("sale ID filter", () => {
        it("should filter sales by ID", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today",
                    saleId: "1"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.map((sale: any) => sale.id).sort(
                    (a: number, b: number) => a - b
                )
            ).toEqual([1, 10]);
        });

        it("should return an empty array if the sale ID does not exist", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today",
                    saleId: "999"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);
            expect(response.body.result).toEqual([]);
        });
    });

    describe("date filter", () => {
        it("should not include sales before the date range", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((sale: any) => sale.id === 4)
            ).toBe(false);
        });

        it("should not include a sale exactly at the end of the date range", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((sale: any) => sale.id === 5)
            ).toBe(false);
        });
    });

    describe("data isolation", () => {
        it("should not allow a cashier to see another cashier's sales", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${cashierToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((sale: any) => sale.id === 2)
            ).toBe(false);

            expect(
                response.body.result.some((sale: any) => sale.id === 3)
            ).toBe(false);
        });

        it("should not allow an admin to see sales from another branch", async () => {
            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            expect(
                response.body.result.some((sale: any) => sale.id === 2)
            ).toBe(false);

            expect(
                response.body.result.some((sale: any) => sale.id === 3)
            ).toBe(false);
        });
    });

    describe("role authorization", () => {
        it("should return 403 for root", async () => {
            const token = generateTokenTest(6, "root", 1);

            const response = await request(app)
                .get("/history")
                .query({
                    date: "today"
                })
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/history", "get");
});