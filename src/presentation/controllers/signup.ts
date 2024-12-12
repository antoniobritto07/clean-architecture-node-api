import { HttpResponse, HttpRequest } from "../protocols/http"
import { Controller } from "../protocols/controller"
import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { EmailValidator } from "../protocols/emailValidator"
import { InvalidParamError } from "../errors/invalid-param-error"

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  //this implements() forces all the controllers to follow the same pattern

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError("email"))
    }
  }
}
