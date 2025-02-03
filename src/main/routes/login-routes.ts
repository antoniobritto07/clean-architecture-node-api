import { Router } from "express"
import { adapRoute } from "../adapters/express/express-route-adpater"
import { makeLoginController } from "../factories/login/login-factory"

export default (router: Router): void => {
  router.post("/login", adapRoute(makeLoginController()))
}
