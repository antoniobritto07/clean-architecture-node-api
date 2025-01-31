import { Router } from "express"
import { makeSignUpController } from "../factories/signup/signup"
import { adapRoute } from "../adapters/express-route-adpater"

export default (router: Router): void => {
  router.post("/signup", adapRoute(makeSignUpController()))
}
