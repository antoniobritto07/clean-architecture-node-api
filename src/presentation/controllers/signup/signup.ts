import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
  Validation,
} from "./signup-protocols"
import { badRequest, serverError, ok } from "../../helpers/http-helper"
import { InvalidParamError, MissingParamError } from "../../errors"
import { AddAccount } from "../../../domain/usecases/add-account"

export class SignUpController implements Controller {
  //this implements() forces all the controllers to follow the same pattern
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation,
  ) {
    //example of dependency inversion
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, password, email } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
