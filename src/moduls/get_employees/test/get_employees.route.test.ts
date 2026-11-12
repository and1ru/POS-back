import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { myDb } from "../../../helper/pool";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";

describe("Route GET /employees", () => {
    beforeAll(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (id, name, date)
            VALUES
                (1, 'Company One', '2026-11-04'),
                (2, 'Company Two', '2026-11-04');

            INSERT INTO branches (id, name, address, city, company_id)
            VALUES
                (1, 'Branch One', 'Address One', 'Medellin', 1),
                (10, 'Branch Ten', 'Address Ten', 'Medellin', 1),
                (3, 'Branch Three', 'Address Three', 'Bogota', 2);

            INSERT INTO users (id, name, email, password, role, company_id)
            VALUES
                (1, 'Owner One', 'owner@test.com', 'password', 'owner', 1),
                (2, 'Admin One', 'admin@test.com', 'password', 'admin', 1),
                (3, 'Root One', 'root@test.com', 'password', 'root', 1),
                (4, 'Ana Lopez', 'ana@test.com', 'password', 'cashier', 1),
                (5, 'Carlos Ruiz', 'carlos@test.com', 'password', 'cashier', 1),
                (6, 'Maria Perez', 'maria@test.com', 'password', 'cashier', 1),
                (7, 'Ana Other', 'other@test.com', 'password', 'cashier', 2),
                (8, 'Ana Ten', 'anaten@test.com', 'password', 'cashier', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-04', 2000),
                (4, 1, '2026-11-04', 1500),
                (5, 1, '2026-11-04', 1600),
                (6, 10, '2026-11-04', 1700),
                (7, 3, '2026-11-04', 1800),
                (8, 10, '2026-11-04', 1900);

            COMMIT;
        `);
    });

    afterAll(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE employees;
            TRUNCATE TABLE users;
            TRUNCATE TABLE branches;
            TRUNCATE TABLE companies;

            SET FOREIGN_KEY_CHECKS = 1;
        `);
    });

    describe("successful requests", () => {
        it("should allow an owner to get employees from their company", async () => {
            const response = await request(app)
                .get("/employees")
                .query({
                    employeeName: "Ana",
                    employeeRole: "cashier"
                })
                .set("Cookie", generateTokenTest(1, "owner", 1));

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("got employees");
            expect(response.body.success).toBe(true);
            expect(response.body.result).toHaveLength(2);

            expect(response.body.result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 4,
                        name: "Ana Lopez",
                        branch_name: "Branch One"
                    }),
                    expect.objectContaining({
                        id: 8,
                        name: "Ana Ten",
                        branch_name: "Branch Ten"
                    })
                ])
            );

            expect(response.body.result).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 7,
                        name: "Ana Other"
                    })
                ])
            );
        });

        it("should allow an admin to get cashiers from their own branch", async () => {
            const response = await request(app)
                .get("/employees")
                .query({
                    employeeName: "Ana"
                })
                .set("Cookie", generateTokenTest(2, "admin", 1));

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("got employees");
            expect(response.body.success).toBe(true);

            expect(response.body.result).toEqual([
                expect.objectContaining({
                    id: 4,
                    name: "Ana Lopez",
                    role: "cashier",
                    branch_name: "Branch One"
                })
            ]);
        });
    });

    describe("filters and isolation", () => {
        it("should filter owner employees by branch ID exactly", async () => {
            const response = await request(app)
                .get("/employees")
                .query({
                    employeeName: "Ana",
                    employeeRole: "cashier",
                    employeeBranch: "1"
                })
                .set("Cookie", generateTokenTest(1, "owner", 1));

            expect(response.status).toBe(200);

            expect(response.body.result).toHaveLength(1);
            expect(response.body.result[0]).toMatchObject({
                id: 4,
                name: "Ana Lopez",
                branch_name: "Branch One"
            });
        });

        it("should not allow an admin to get employees from another branch", async () => {
            const response = await request(app)
                .get("/employees")
                .query({
                    employeeName: "Maria"
                })
                .set("Cookie", generateTokenTest(2, "admin", 1));

            expect(response.status).toBe(200);
            expect(response.body.result).toEqual([]);
        });

        it("should not return employees from another company to an owner", async () => {
            const response = await request(app)
                .get("/employees")
                .query({
                    employeeName: "Ana",
                    employeeRole: "cashier"
                })
                .set("Cookie", generateTokenTest(1, "owner", 1));

            expect(response.status).toBe(200);
            expect(response.body.result).toHaveLength(2);

            expect(response.body.result).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 7,
                        name: "Ana Other"
                    })
                ])
            );
        });
    });

    describe("invalid query parameters", () => {
        it("should return 400 if employeeName is repeated", async () => {
            const response = await request(app)
                .get("/employees?employeeName=Ana&employeeName=Carlos")
                .set("Cookie", generateTokenTest(1, "owner", 1));

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "",
                success: false
            });
        });

        it("should return 400 if employeeRole is repeated", async () => {
            const response = await request(app)
                .get("/employees?employeeRole=cashier&employeeRole=admin")
                .set("Cookie", generateTokenTest(1, "owner", 1));

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "",
                success: false
            });
        });

        it("should return 400 if employeeBranch is repeated", async () => {
            const response = await request(app)
                .get("/employees?employeeBranch=1&employeeBranch=10")
                .set("Cookie", generateTokenTest(1, "owner", 1));

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "",
                success: false
            });
        });
    });

    describe("role authorization", () => {
        it.each([
            { userId: 3, role: "root" as const },
            { userId: 4, role: "cashier" as const }
        ])("should return 403 for role $role", async ({ userId, role }) => {
            const response = await request(app)
                .get("/employees")
                .set("Cookie", generateTokenTest(userId, role, 1));

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/employees", "get");
});