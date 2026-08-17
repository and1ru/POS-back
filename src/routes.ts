import { Router } from "express";
import login from './login/login.route.ts'
import auth from './Auth/Auth.route.ts'
import company from './create_company/create_company.route.ts'
import logOut from './logOut/logOut.route.ts'
import branch from './create_branch/create_branch.route.ts'
import branches from './get_branches/get_branches.route.ts'

const routes = Router()

routes.use(login)
routes.use(auth)
routes.use(company)
routes.use(logOut)
routes.use(branch)
routes.use(branches)

export default routes