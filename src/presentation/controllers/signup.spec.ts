import { describe, expect, test, jest } from "@jest/globals"
import { SignUpController } from "./signup"
import { MissingParamError } from "../errors/missing-param-error"
import { InvalidParamError } from "../errors/invalid-param-error"
import { EmailValidator } from "../protocols/emailValidator"

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    //this isn't a production class, we're injecting a EmailValidator mocked version into our controller
    isValid(email: string): boolean {
      //Stub is one Mock type, and basically we attribute an direct value for a function, as in this case (since we're returning true directly)
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub) //example of dependency injection

  return {
    sut,
    emailValidatorStub,
  }
}
describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const { sut } = makeSut() //sut means System Under Test
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("name"))
  })

  test("should return 400 if no email is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
  })

  test("should return 400 if no password is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("password"))
  })

  test("should return 400 if no password confirmation is provided", () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation"),
    )
  })

  test("should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut()
    //manually mocking the stub default return value to force it fail, and then test the functionality
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError("email"))
  })
})
