import env from "../../config/env"
import { LoginController } from "../../../presentation/controllers/login/login-controller"
import { makeLoginValidation } from "./login-validation-factory"
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../infra/jwt-adapter/jwt-adapter"

import { Controller } from "../../../presentation/protocols"
import { LogControllerDecorator } from "../../decorators/log-controller-decorator"

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  )
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
