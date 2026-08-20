import { Router } from "express";
import { CreateCompanyController } from "./create_company.controller";
import { CreateCompanyService } from "./create_company.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new CreateCompanyService()
const controller = new CreateCompanyController(service)

const route = Router()

route.post("/company", authToken, authRole("root"), controller.createCompany)

export default route