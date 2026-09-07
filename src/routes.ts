import { Router } from "express";
import login from './moduls/login/login.route.ts'
import auth from './moduls/Auth/Auth.route.ts'
import company from './moduls/create_company/create_company.route.ts'
import logOut from './moduls/logOut/logOut.route.ts'
import branch from './moduls/create_branch/create_branch.route.ts'
import branches from './moduls/get_branches/get_branches.route.ts'
import product from './moduls/create_product/create_product.route.ts'
import hire from './moduls/Hire/Hire.route.ts'
import employees from './moduls/get_employees/get_employees.route.ts'

const routes = Router()

routes.use(login)
routes.use(auth)
routes.use(company)
routes.use(logOut)
routes.use(branch)
routes.use(branches)
routes.use(product)
routes.use(hire)
routes.use(employees)

export default routes