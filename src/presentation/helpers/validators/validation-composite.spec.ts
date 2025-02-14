import { describe, expect, test, jest } from "@jest/globals"
import { ValidationComposite } from "./validation-composite"
import { MissingParamError } from "../../errors"
import { Validation } from "../../protocols/validation"

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
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs,
  }
}

describe("Validation Composite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValue(new MissingParamError("field"))
    const error = sut.validate({ field: "any_value" })

    expect(error).toEqual(new MissingParamError("field"))
  })

  test("Should return the first error if more than one validation fails", () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], "validate").mockReturnValue(new Error())

    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValue(new MissingParamError("field"))
    const error = sut.validate({ field: "any_value" })

    expect(error).toEqual(new Error())
  })

  test("Should not return if validation succeeds", () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: "any_value" })

    expect(error).toBeFalsy()
  })
})
