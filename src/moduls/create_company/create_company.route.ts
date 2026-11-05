import { Router } from "express";
import { CreateCompanyController } from "./create_company.controller";
import { CreateCompanyService } from "./create_company.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { companySchema } from "./create_company.schema";

const service = new CreateCompanyService()
const controller = new CreateCompanyController(service)

const route = Router()

route.post("/company", authToken, authRole("root"), validationBody(companySchema), controller.createCompany)

export default route