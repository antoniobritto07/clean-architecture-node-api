import { describe, expect, test, jest } from "@jest/globals"
import {
  RequiredFieldValidation,
  CompareFieldValidation,
  EmailValidation,
  ValidationComposite,
} from "../../../presentation/helpers/validators"
import { makeSignUpValidation } from "../signup/signup-validation-factory"
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

describe("SignUpValidation Factory", () => {
  test("should call ValidationComposite with all validations", () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new CompareFieldValidation("password", "passwordConfirmation"),
    )
    validations.push(new EmailValidation("email", makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
