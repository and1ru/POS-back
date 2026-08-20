import { Router } from "express";
import { GetBranchesController } from "./get_branches.controller";
import { GetBranchesService } from "./get_branches.service";
import { authToken } from "../../middleware/authToken";
import { authRole } from "../../middleware/authRole";

const service = new GetBranchesService()
const controller = new GetBranchesController(service)

const route = Router()

route.get("/branch", authToken, authRole("owner"), controller.getBranches)

export default route