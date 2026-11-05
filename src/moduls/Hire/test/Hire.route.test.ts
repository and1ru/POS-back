import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { myDb } from "../../../helper/pool";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";

describe("Route POST /hire", () => {
    const validBody = {
        name: "Employee One",
        email: "employee@test.com",
        password: "password123",
        role: "cashier",
        salary: 1500,
        branch: "1"
    };

    const ownerToken = generateTokenTest(1, "owner", 1);
    const adminToken = generateTokenTest(2, "admin", 1);

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
                (4, 'Cashier One', 'cashier@test.com', 'password', 'cashier', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-04', 2000),
                (4, 1, '2026-11-04', 1500);

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
        it("should allow an owner to hire a cashier", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(validBody);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "employee hire",
                success: true
            });

            const [result] = await myDb.query(
                `
                    SELECT
                        users.id,
                        users.name,
                        users.email,
                        users.role,
                        users.company_id,
                        users.password,
                        employees.branch_id,
                        employees.salary
                    FROM users
                    INNER JOIN employees ON employees.user_id = users.id
                    WHERE users.email = ?
                `,
                [validBody.email]
            ) as any;

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                name: validBody.name,
                email: validBody.email,
                role: "cashier",
                company_id: 1,
                branch_id: 1,
                salary: "1500.00"
            });

            expect(result[0].password).not.toBe(validBody.password);
        });

        it("should allow an owner to hire an admin", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({
                    ...validBody,
                    email: "new-admin@test.com",
                    role: "admin",
                    branch: "2"
                });

            expect(response.status).toBe(201);

            const [result] = await myDb.query(
                `
                    SELECT
                        users.role,
                        users.company_id,
                        employees.branch_id
                    FROM users
                    INNER JOIN employees ON employees.user_id = users.id
                    WHERE users.email = ?
                `,
                ["new-admin@test.com"]
            ) as any;

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                role: "admin",
                company_id: 1,
                branch_id: 2
            });
        });

        it("should allow an admin to hire a cashier in their own branch", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...validBody,
                    email: "new-cashier@test.com",
                    branch: "2"
                });

            expect(response.status).toBe(201);

            const [result] = await myDb.query(
                `
                    SELECT
                        users.role,
                        users.company_id,
                        employees.branch_id
                    FROM users
                    INNER JOIN employees ON employees.user_id = users.id
                    WHERE users.email = ?
                `,
                ["new-cashier@test.com"]
            ) as any;

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                role: "cashier",
                company_id: 1,
                branch_id: 1
            });
        });
    });

    describe("business rules", () => {
        it("should return 400 if the email already exists", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({
                    ...validBody,
                    email: "admin@test.com"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("credentials error");
        });

        it("should return 403 if an admin tries to hire another admin", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...validBody,
                    email: "another-admin@test.com",
                    role: "admin"
                });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("admin can not hire an admin");
        });

        it("should not allow an owner to hire an employee in another company's branch", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({
                    ...validBody,
                    email: "wrong-branch@test.com",
                    branch: "3"
                });

            expect(response.status).toBe(403);

            const [result] = await myDb.query(
                "SELECT id FROM users WHERE email = ?",
                ["wrong-branch@test.com"]
            ) as any;

            expect(result).toHaveLength(0);
        });
    });

    describe("schema validation", () => {
        it("should return 400 if name is empty", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, name: "" });

            expect(response.status).toBe(400);
        });

        it("should return 400 if email is invalid", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, email: "invalid-email" });

            expect(response.status).toBe(400);
        });

        it("should return 400 if password has fewer than 8 characters", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, password: "1234567" });

            expect(response.status).toBe(400);
        });

        it("should return 400 if salary is not a number", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, salary: "1500" });

            expect(response.status).toBe(400);
        });

        it("should return 400 if salary is zero", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, salary: 0 });

            expect(response.status).toBe(400);
        });

        it("should return 400 if salary is negative", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, salary: -1500 });

            expect(response.status).toBe(400);
        });

        it("should return 400 if role is invalid", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, role: "root" });

            expect(response.status).toBe(400);
        });

        it("should return 400 if branch is not a string", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, branch: 1 });

            expect(response.status).toBe(400);
        });

        it("should return 400 if branch is missing", async () => {
            const { branch, ...body } = validBody;

            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(body);

            expect(response.status).toBe(400);
        });

        it("should return 400 if branch is empty", async () => {
            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send({ ...validBody, branch: "" });

            expect(response.status).toBe(400);
        });
    });

    describe("role authorization", () => {
        it.each([
            { userId: 3, role: "root" as const },
            { userId: 4, role: "cashier" as const }
        ])("should return 403 for role $role", async ({ userId, role }) => {
            const token = generateTokenTest(userId, role, 1);

            const response = await request(app)
                .post("/hire")
                .set("Authorization", `Bearer ${token}`)
                .send(validBody);

            expect(response.status).toBe(403);
        });
    });

    tokenTest("/hire", "post");
});