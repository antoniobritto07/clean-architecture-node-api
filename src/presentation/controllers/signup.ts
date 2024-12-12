import { HttpResponse, HttpRequest } from "../protocols/http"
import { Controller } from "../protocols/controller"
import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"

export class SignUpController implements Controller {
  //this implements() forces all the controllers to follow the same pattern
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
