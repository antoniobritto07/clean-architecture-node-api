import { describe, expect, test, jest } from "@jest/globals"
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators"
import { makeLoginValidation } from "../login/login-validation-factory"
import { Validation } from "../../../presentation/protocols/validation"
import { EmailValidator } from "../../../presentation/protocols/email-validator"

jest.mock("../../../presentation/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe("LoginValidation Factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation("email", makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
