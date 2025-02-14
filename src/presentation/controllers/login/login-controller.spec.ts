import { describe, expect, test, jest } from "@jest/globals"
import { LoginController } from "./login-controller"
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http/http-helper"
import { MissingParamError } from "../../errors"
import {
  HttpRequest,
  Authentication,
  Validation,
  AuthenticationModel,
} from "./login-controller-protocols"

//the difference between mockImplementationOnce and mockReturnValueOnce is that the first one tries to
//all the structure of the return of the method. whereas the second one only change what is being returned.

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise((resolve) => resolve("any_token"))
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub,
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
})

describe("Login Controller", () => {
  // test("should return 400 if no email is provided", async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       password: "any_password",
  //     },
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  // })

  // test("should return 400 if no password is provided", async () => {
  //   const { sut } = makeSut()
  //   const httpRequest = {
  //     body: {
  //       email: "any_email@mail.com",
  //     },
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  // })

  // test("should call EmailValidator with correct email", async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
  //   await sut.handle(makeFakeRequest())
  //   expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com")
  // })

  // test("should return 400 is an invalid email is provided", async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
  // })

  // test("should return 500 if EmailValidator throws", async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
  //     throw new Error()
  //   })
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(serverError(new Error()))
  // })

  test("should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@mail.com",
      password: "any_password",
    })
  })

  test("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve(null)
      }),
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test("should return 200 if invalid credentials are provided", async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      ok({
        accessToken: "any_token",
      }),
    )
  })

  test("should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })
})
