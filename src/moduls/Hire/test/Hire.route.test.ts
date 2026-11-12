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

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (name, date)
            VALUES
                ('Company One', '2026-11-04'),
                ('Company Two', '2026-11-04');

            INSERT INTO branches (name, address, city, company_id)
            VALUES
                ('Branch One', 'Address One', 'Medellin', 1),
                ('Branch Two', 'Address Two', 'Medellin', 1),
                ('Branch Three', 'Address Three', 'Bogota', 2);

            INSERT INTO users (name, email, password, role, company_id)
            VALUES
                ('Owner One', 'owner@test.com', 'password', 'owner', 1),
                ('Admin One', 'admin@test.com', 'password', 'admin', 1),
                ('Cashier One', 'cashier@test.com', 'password', 'cashier', 1);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-04', 2000),
                (3, 1, '2026-11-04', 1500);

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

    it("should allow an owner to hire a cashier", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send(validBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "employee hire",
            success: true
        });
    });

    it("should allow an owner to hire an admin", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({
                ...validBody,
                email: "new-admin@test.com",
                role: "admin",
                branch: "2"
            });

        expect(response.status).toBe(201);
    });

    it("should allow an admin to hire a cashier in their own branch", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send({
                ...validBody,
                email: "new-cashier@test.com",
                branch: "2"
            });

        expect(response.status).toBe(201);
    });

    it("should return 400 if the email already exists", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
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
            .set("Cookie", generateTokenTest(1, "admin", 1))
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
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({
                ...validBody,
                email: "wrong-branch@test.com",
                branch: "3"
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "did not find branch", success: false })
    });

    it("should return 400 if name is empty", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, name: "" });

        expect(response.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, email: "invalid-email" });

        expect(response.status).toBe(400);
    });

    it("should return 400 if password has fewer than 8 characters", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, password: "1234567" });

        expect(response.status).toBe(400);
    });

    it("should return 400 if salary is not a number", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, salary: "1500" });

        expect(response.status).toBe(400);
    });

    it("should return 400 if salary is zero", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, salary: 0 });

        expect(response.status).toBe(400);
    });

    it("should return 400 if salary is negative", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, salary: -1500 });

        expect(response.status).toBe(400);
    });

    it("should return 400 if role is invalid", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, role: "root" });

        expect(response.status).toBe(400);
    });

    it("should return 400 if branch is missing", async () => {
        const { branch, ...body } = validBody;

        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send(body);

        expect(response.status).toBe(400);
    });

    it("should return 400 if branch is empty", async () => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...validBody, branch: "" });

        expect(response.status).toBe(400);
    });

    it.each([
        { userId: 3, role: "root" as const },
        { userId: 4, role: "cashier" as const }
    ])("should return 403 for role $role", async ({ userId, role }) => {
        const response = await request(app)
            .post("/hire")
            .set("Cookie", generateTokenTest(userId, role, 1))
            .send(validBody);

        expect(response.status).toBe(403);
    });

    tokenTest("/hire", "post");
});