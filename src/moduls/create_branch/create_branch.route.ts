import { Router } from "express";
import { CreateBranchController } from "./create_branch.controller";
import { CreateBranchService } from "./create_branch.service";
import { authToken } from "../../middleware/authToken/authToken";
import { authRole } from "../../middleware/authRole/authRole";
import { validationBody } from "../../middleware/validationBody";
import { branchSchema } from "./create_branch.schema";

const service = new CreateBranchService()
const controller = new CreateBranchController(service)

const route = Router()

route.post("/branch", authToken, authRole("owner"), validationBody(branchSchema), controller.createBranch)

export default route