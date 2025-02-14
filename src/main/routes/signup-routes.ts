import { Router } from "express"
import { adapRoute } from "../adapters/express/express-route-adpater"
import { makeSignUpController } from "../factories/signup/signup-factory"

export default (router: Router): void => {
  router.post("/signup", adapRoute(makeSignUpController()))
}
