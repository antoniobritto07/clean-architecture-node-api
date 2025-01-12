import { describe, test, expect, jest } from "@jest/globals"
import { LogControllerDecorator } from "./log"
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"

describe("Log Controller Decorator", () => {
  test("should call controller handle", async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          statusCode: 200,
          body: {
            name: "Antonio",
          },
        }
        return new Promise((resolve) => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, "handle")
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        email: "any_mail@example.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
