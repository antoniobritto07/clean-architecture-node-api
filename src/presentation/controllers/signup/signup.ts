import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
} from "./signup-protocols"
import { badRequest, serverError } from "../../helpers/http-helper"
import { InvalidParamError, MissingParamError } from "../../errors"
import { AddAccount } from "../../../domain/usecases/add-account"

export class SignUpController implements Controller {
  //this implements() forces all the controllers to follow the same pattern
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    //example of dependency inversion
    this.emailValidator = emailValidator
    this.addAccount = addAccount
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
      const { name, password, passwordConfirmation, email } = httpRequest.body
      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }

      this.addAccount.add({
        name,
        email,
        password,
      })
    } catch (error) {
      return serverError()
    }
  }
}
