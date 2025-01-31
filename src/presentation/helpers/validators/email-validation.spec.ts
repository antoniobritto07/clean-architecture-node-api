import { describe, expect, test, jest } from "@jest/globals"
import { EmailValidator } from "../../protocols/email-validator"
import { EmailValidation } from "./email-validation"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation("email", emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe("Email Validation", () => {
  test("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    sut.validate({ email: "any_email@email.com" })
    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com")
  })

  test("should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
