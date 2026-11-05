import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { myDb } from "../../../helper/pool";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";

describe("Route GET /employee/:employeeId", () => {
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
                (3, 'Root One', 'root@test.com', 'password', 'root', 1),
                (4, 'Cashier One', 'cashier@test.com', 'password', 'cashier', 1),
                (5, 'Employee Same Branch', 'employee1@test.com', 'password', 'cashier', 1),
                (6, 'Employee Other Branch', 'employee2@test.com', 'password', 'cashier', 1),
                (7, 'Employee Other Company', 'employee3@test.com', 'password', 'cashier', 2);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-04', 2000),
                (5, 1, '2026-11-04', 1500),
                (6, 2, '2026-11-04', 1600),
                (7, 3, '2026-11-04', 1700);

            COMMIT;
        `);
    });

    afterEach(async () => {
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
        it("should allow an owner to get an employee from another branch of the same company", async () => {
            const token = generateTokenTest(1, "owner", 1);

            const response = await request(app)
                .get("/employee/6")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body).toMatchObject({
                message: "got employee",
                success: true,
                result: {
                    id: 6,
                    name: "Employee Other Branch",
                    role: "cashier",
                    branch_name: "Branch Two",
                    branch_id: 2
                }
            });
        });

        it("should allow an admin to get an employee from their own branch", async () => {
            const token = generateTokenTest(2, "admin", 1);

            const response = await request(app)
                .get("/employee/5")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);

            expect(response.body).toMatchObject({
                message: "got employee",
                success: true,
                result: {
                    id: 5,
                    name: "Employee Same Branch",
                    role: "cashier",
                    branch_name: "Branch One",
                    branch_id: 1
                }
            });
        });
    });

    describe("not found and tenant isolation", () => {
        it("should return 404 if an owner tries to get an employee from another company", async () => {
            const token = generateTokenTest(1, "owner", 1);

            const response = await request(app)
                .get("/employee/7")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "user not found"
            });
        });

        it("should return 404 if an admin tries to get an employee from another branch", async () => {
            const token = generateTokenTest(2, "admin", 1);

            const response = await request(app)
                .get("/employee/6")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "user not found"
            });
        });

        it("should return 404 if an admin tries to get an employee from another company", async () => {
            const token = generateTokenTest(2, "admin", 1);

            const response = await request(app)
                .get("/employee/7")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "user not found"
            });
        });

        it("should return 404 if the employee does not exist", async () => {
            const token = generateTokenTest(1, "owner", 1);

            const response = await request(app)
                .get("/employee/999")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({
                message: "user not found"
            });
        });
    });

    describe("role authorization", () => {
        it.each([
            { userId: 3, role: "root" as const },
            { userId: 4, role: "cashier" as const }
        ])("should return 403 for role $role", async ({ userId, role }) => {
            const token = generateTokenTest(userId, role, 1);

            const response = await request(app)
                .get("/employee/5")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/employee/5", "get");
});