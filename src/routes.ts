import { Router } from "express";
import register from './register/register.route.ts'

const routes = Router()

routes.use(register)

export default routes