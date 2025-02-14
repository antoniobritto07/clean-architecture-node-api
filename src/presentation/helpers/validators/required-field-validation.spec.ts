import { describe, expect, test } from "@jest/globals"
import { RequiredFieldValidation } from "./required-field-validation"
import { MissingParamError } from "../../errors"

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation("field")
}
describe("RequiredField", () => {
  test("should return a MissingParamError if validation fails", () => {
    const sut = makeSut()
    const error = sut.validate({ name: "any_name" })

    expect(error).toEqual(new MissingParamError("field"))
  })

  test("should not return if validation succeeds", () => {
    const sut = makeSut()
    const error = sut.validate({ field: "any_name" })

    expect(error).toBeFalsy() // doesn't have any value = null/undefined/0
  })
})
