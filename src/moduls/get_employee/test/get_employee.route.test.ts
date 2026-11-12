import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { myDb } from "../../../helper/pool";
import { generateTokenTest } from "../../../helper/generateTokenTest";
import { app } from "../../../app";
import { tokenTest } from "../../../helper/tokenTest";
import { beforeAll } from "vitest";

describe("Route GET /employee/:employeeId", () => {
    beforeAll(async () => {
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
                1('Owner One', 'owner@test.com', 'password', 'owner', 1),
                2('Admin One', 'admin@test.com', 'password', 'admin', 1),
                3('Root One', 'root@test.com', 'password', 'root', 1),
                4('Cashier One', 'cashier@test.com', 'password', 'cashier', 1),
                5('Employee Same Branch', 'employee1@test.com', 'password', 'cashier', 1),
                6('Employee Other Branch', 'employee2@test.com', 'password', 'cashier', 1),
                7('Employee Other Company', 'employee3@test.com', 'password', 'cashier', 2);

            INSERT INTO employees (user_id, branch_id, date, salary)
            VALUES
                (2, 1, '2026-11-04', 2000),
                (5, 1, '2026-11-04', 1500),
                (6, 2, '2026-11-04', 1600),
                (7, 3, '2026-11-04', 1700);

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

    // owner puede ver el employee si es de su company
    it("should allow an owner to get an employee from another branch of the same company", async () => {
        const response = await request(app)
            .get("/employee/6")
            .set("Cookie", generateTokenTest(1, "owner", 1));

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
        const response = await request(app)
            .get("/employee/5")
            .set("Cookie", generateTokenTest(2, "admin", 1));

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

    // retorna error si hay un usuario pero no es de su company
    it("should return 404 if an owner tries to get an employee from another company", async () => {
        const response = await request(app)
            .get("/employee/7")
            .set("Cookie", generateTokenTest(1, "owner", 1));

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            message: "user not found"
        });
    });

    it("should return 404 if an admin tries to get an employee from another branch", async () => {
        const response = await request(app)
            .get("/employee/6")
            .set("Cookie", generateTokenTest(2, "admin", 1));

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            message: "user not found"
        });
    });

    it("should return 404 if an admin tries to get an employee from another company", async () => {
        const response = await request(app)
            .get("/employee/7")
            .set("Cookie", generateTokenTest(2, "admin", 1));

        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: "user not found", success:false});
    });

    // agregar un 404 si un admin intenta acceder a otro admin ya sea de su branch o de otra branch

    it("should return 404 if the employee does not exist", async () => {
        const response = await request(app)
            .get("/employee/999")
            .set("Cookie", generateTokenTest(1, "owner", 1));

        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: "user not found", success:false});
    });

    it.each([
        { userId: 3, role: "root" as const },
        { userId: 4, role: "cashier" as const }
    ])("should return 403 for role $role", async ({ userId, role }) => {
        const response = await request(app)
            .get("/employee/5")
            .set("Cookie", generateTokenTest(userId, role, 1));

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message:"user no authorizated", success:false})
    });

    tokenTest("/employee/5", "get");
});