import {
  HttpResponse,
  HttpRequest,
  Controller,
  Validation,
} from "./signup-protocols"
import { badRequest, serverError, ok } from "../../helpers/http/http-helper"
import { AddAccount } from "../../../domain/usecases/add-account"

export class SignUpController implements Controller {
  //this implements() forces all the controllers to follow the same pattern
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(addAccount: AddAccount, validation: Validation) {
    //example of dependency inversion
    this.addAccount = addAccount
    this.validation = validation
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      //controller itself is the component that will define the format of the error http message
      if (error) {
        return badRequest(error)
      }

      const { name, password, email } = httpRequest.body

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
