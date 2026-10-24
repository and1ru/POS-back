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
import inventory from './moduls/inventory/inventory.route.ts'
import createProduct from './moduls/create_branch_product/create_branch_product.route.ts'
import updateBranchProduct from './moduls/update_branch_product/update_branch_product.route.ts'
import employee from './moduls/get_employee/get_employee.route.ts'
import updateProduct from './moduls/update_product/update_product.route.ts'
import updateEmployee from './moduls/update_employee/update_employee.route.ts'

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
routes.use(inventory)
routes.use(createProduct)
routes.use(updateBranchProduct)
routes.use(employee)
routes.use(updateProduct)
routes.use(updateEmployee)

export default routes