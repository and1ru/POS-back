import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { generateTokenTest } from '../../../helper/generateTokenTest'
import { myDb } from '../../../helper/pool'
import { tokenTest } from '../../../helper/tokenTest'

describe("Route GET /branch", () => {

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (name, date)
            VALUES
                ("Company One", "2000-01-01"),
                ("Company Two", "2000-01-01");

            INSERT INTO branches
                (name, address, city, company_id)
            VALUES
                ("Sucursal Centro", "Calle 10", "Medellin", 1),
                ("Sucursal Norte", "Calle 20", "Bogota", 1),
                ("Sucursal Sur", "Calle 30", "Cali", 2);

            COMMIT;
        `)
    })

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE branches;
            TRUNCATE TABLE companies;

            SET FOREIGN_KEY_CHECKS = 1;
        `)
    })

    it("should return company branches successfully", async () => {
        const result = [
            {
                name: "Sucursal Centro",
                id: 1,
                city: "Medellin"
            },
            {
                name: "Sucursal Norte",
                id: 2,
                city: "Bogota"
            }
        ]

        const response = await request(app)
            .get("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 1))

        expect(response.status).toBe(200)

        expect(response.body).toEqual({
            message: "got branches",
            status: true,
            result
        })
    })

    it("should return an empty array when company has no branches", async () => {
        const response = await request(app)
            .get("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 999))

        expect(response.status).toBe(200)

        expect(response.body).toEqual({
            message: "got branches",
            status: true,
            result: []
        })
    })

    it("should only return branches belonging to the authenticated company", async () => {
        const response = await request(app)
            .get("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 2))

        expect(response.status).toBe(200)

        expect(response.body).toEqual({
            message: "got branches",
            status: true,
            result: [
                {
                    name: "Sucursal Sur",
                    id: 3,
                    city: "Cali"
                }
            ]
        })

        expect(response.body.result).not.toContainEqual({
            name: "Sucursal Centro",
            id: 1,
            city: "Medellin"
        })
    })

    it("should return 403 when root tries to get branches", async () => {
        const response = await request(app)
            .get("/branch")
            .set("Cookie", generateTokenTest(1, "root", 1))

        expect(response.status).toBe(403)
    })

    it("should return 403 when admin tries to get branches", async () => {
        const response = await request(app)
            .get("/branch")
            .set("Cookie", generateTokenTest(1, "admin", 1))

        expect(response.status).toBe(403)
    })

    it("should return 403 when cashier tries to get branches", async () => {
        const response = await request(app)
            .get("/branch")
            .set("Cookie", generateTokenTest(1, "cashier", 1))

        expect(response.status).toBe(403)
    })

    tokenTest("/branch", "get")
})
