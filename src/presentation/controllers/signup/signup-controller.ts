import {
  HttpResponse,
  HttpRequest,
  Controller,
  Validation,
} from "./signup-controller-protocols"
import { badRequest, serverError, ok } from "../../helpers/http/http-helper"
import { AddAccount } from "../../../domain/usecases/add-account"

export class SignUpController implements Controller {
  //this implements() forces all the controllers to follow the same pattern
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {
    //example of dependency inversion
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
