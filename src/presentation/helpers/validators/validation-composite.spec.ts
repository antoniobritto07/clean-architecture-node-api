import { describe, expect, test, jest } from "@jest/globals"
import { ValidationComposite } from "./validation-composite"
import { MissingParamError } from "../../errors"
import { Validation } from "./validation"

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null // default is to not return any error
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub,
  }
}

describe("Validation Composite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValue(new MissingParamError("field"))
    const error = sut.validate({ field: "any_value" })

    expect(error).toEqual(new MissingParamError("field"))
  })
})
