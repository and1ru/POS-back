
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import type { RowDataPacket } from 'mysql2'
import { app } from '../../../app'
import { generateTokenTest } from '../../../helper/generateTokenTest'
import { myDb } from '../../../helper/pool'
import { tokenTest } from '../../../helper/tokenTest'

describe("Route POST /company", () => {
    const body = {
        companyName: "new company",
        ownerName: "andres",
        email: "newowner@gmail.com",
        password: "password123",
        confirmPassword: "password123"
    }

    beforeEach(async () => {
        await myDb.query(`
            START TRANSACTION;

            INSERT INTO companies (name, date)
            VALUES ("root company", "2000-01-01");

            SET @company_id = LAST_INSERT_ID();

            INSERT INTO users
                (name, email, password, role, company_id)
            VALUES
                ("Owner", "owner@test.com", "test-password", "owner", @company_id),
            COMMIT;
        `)
    })

    afterEach(async () => {
        await myDb.query(`
            SET FOREIGN_KEY_CHECKS = 0;

            TRUNCATE TABLE users;
            TRUNCATE TABLE companies;

            SET FOREIGN_KEY_CHECKS = 1;
        `)
    })

    it("should create company and owner successfully", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send(body)

        expect(response.status).toBe(201)

        expect(response.body).toEqual({
            message: "company created",
            success: true
        })
    })

    it("should return 400 when email already exists", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({
                ...body,
                email: "root@test.com"
            })

        expect(response.status).toBe(400)

        expect(response.body).toEqual({
            message: "credentials error",
            success: false
        })
    })

    it("should return 403 when owner tries to create a company", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(2, "owner", 1))
            .send(body)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })
    })

    it("should return 403 when admin tries to create a company", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(3, "admin", 1))
            .send(body)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })

    })

    it("should return 403 when cashier tries to create a company", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(4, "cashier", 1))
            .send(body)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ message: "user no authorizated", success: false })

    })

    // companyName

    it("should return 400 when companyName is empty", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, companyName: "" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when companyName is not a string", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, companyName: 123 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when companyName is missing", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, companyName: undefined })

        expect(response.status).toBe(400)
    })

    // ownerName

    it("should return 400 when ownerName is empty", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, ownerName: "" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when ownerName is not a string", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, ownerName: 123 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when ownerName is missing", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, ownerName: undefined })

        expect(response.status).toBe(400)
    })

    // email

    it("should return 400 when email is invalid", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, email: "invalid-email" })

        expect(response.status).toBe(400)
    })

    it("should return 400 when email is not a string", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, email: 123 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when email is missing", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, email: undefined })

        expect(response.status).toBe(400)
    })

    // password

    it("should return 400 when password has less than 8 characters", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({
                ...body,
                password: "1234567",
                confirmPassword: "1234567"
            })

        expect(response.status).toBe(400)
    })

    it("should return 400 when password is not a string", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, password: 12345678 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when password is missing", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, password: undefined })

        expect(response.status).toBe(400)
    })

    // confirmPassword

    it("should return 400 when confirmPassword has less than 8 characters", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({
                ...body,
                confirmPassword: "1234567"
            })

        expect(response.status).toBe(400)
    })

    it("should return 400 when confirmPassword is not a string", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, confirmPassword: 12345678 })

        expect(response.status).toBe(400)
    })

    it("should return 400 when confirmPassword is missing", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({ ...body, confirmPassword: undefined })

        expect(response.status).toBe(400)
    })

    // refine

    it("should return 400 when passwords do not match", async () => {
        const response = await request(app)
            .post("/company")
            .set("Cookie", generateTokenTest(1, "root", 1))
            .send({
                ...body,
                password: "password123",
                confirmPassword: "different123"
            })

        expect(response.status).toBe(400)
    })

    it("should return 401 when there is no token", async () => {
        const response = await request(app)
            .post("/company")
            .send(body)

        expect(response.status).toBe(401)

        expect(response.body).toEqual({
            message: "no token",
            success: false
        })
    })

    tokenTest("/company", "post")
})