import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
} from "../protocols"
import { badRequest, serverError } from "../helpers/http-helper"
import { InvalidParamError, MissingParamError } from "../errors"

export class SignUpController implements Controller {
  //this implements() forces all the controllers to follow the same pattern
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    //example of dependency inversion
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { password, passwordConfirmation, email } = httpRequest.body
      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }
    } catch (error) {
      return serverError()
    }
  }
}
