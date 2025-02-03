import { Router } from "express"
import { makeSignUpController } from "../factories/signup/signup-factory"
import { adapRoute } from "../adapters/express/express-route-adpater"

export default (router: Router): void => {
  router.post("/signup", adapRoute(makeSignUpController()))
}
