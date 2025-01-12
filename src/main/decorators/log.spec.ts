import { describe, test, expect, jest } from "@jest/globals"
import { LogControllerDecorator } from "./log"
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"
import { serverError } from "../../presentation/helpers/http-helper"
import { LogErrorRepository } from "../../data/protocols/log-error-repository"

const makeController = (): Controller => {
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
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    controllerStub,
    sut,
    logErrorRepositoryStub,
  }
}

describe("Log Controller Decorator", () => {
  test("should call controller handle", async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, "handle")
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

  test("should return the same result of the controller", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: "any_mail@example.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: "Antonio",
      },
    })
  })

  test("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = "any_stack"
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log")
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)))
    const httpRequest = {
      body: {
        email: "any_mail@example.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith("any_stack")
  })
})
