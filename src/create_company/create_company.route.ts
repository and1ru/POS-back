import { Router } from "express";
import { CreateCompanyController } from "./create_company.controller";
import { CreateCompanyService } from "./create_company.service";

const service = new CreateCompanyService()
const controller = new CreateCompanyController(service)

const route = Router()

route.post("/create-company", controller.createCompany)

export default route