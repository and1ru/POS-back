import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { generateTokenTest } from '../../../helper/generateTokenTest'
import { myDb } from '../../../helper/pool'
import { tokenTest } from '../../../helper/tokenTest'

describe("Route POST /branch", () => {
    const body = {
        address: "Calle 10 #20-30",
        city: "Medellin",
        name: "Sucursal Centro"
    }

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;
            INSERT INTO companies (name, date)
            VALUES ("test name", "2000-01-01");

            INSERT INTO 
            branches (name, address, city, company_id) 
            VALUES ("test name","test address","test city",1);
            COMMIT;
        `)
    })

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE companies;
            TRUNCATE TABLE branches;

            SET FOREIGN_KEY_CHECKS = 1;
        `)
    })

    it("should return 201 create a branch successfully", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send(body)

        expect(response.status).toBe(201)
        expect(response.body).toEqual({ message: "branch created", success: true })
    })

    it("should return 403 when role is admin", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "admin", 1))
            .send(body)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 403 when role is root", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send(body)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 403 when role is cashier", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "cashier", 1))
            .send(body)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 400 when name is empty", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...body, name: "" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when city is empty", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...body, city: "" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when address is empty", async () => {
        const response = await request(app)
            .post("/branch")
            .set("Cookie", generateTokenTest(1, "owner", 1))
            .send({ ...body, address: "" })

        expect(response.status).toBe(400)
    })

    tokenTest("/branch", "post")
})