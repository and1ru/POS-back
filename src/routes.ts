import { Router } from "express";
import login from './login/login.route.ts'
import auth from './Auth/Auth.route.ts'

const routes = Router()

routes.use(login)
routes.use(auth)

export default routes