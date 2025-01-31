import { describe, expect, test, jest } from "@jest/globals"
import { RequiredFieldValidation } from "./required-field-validation"
import { MissingParamError } from "../../errors"

describe("RequiredField", () => {
  test("should return a MissingParamError if validation fails", () => {
    const sut = new RequiredFieldValidation("field")
    const error = sut.validate({ name: "any_name" })

    expect(error).toEqual(new MissingParamError("field"))
  })

  test("should not return an error when a required field is present", () => {})
})
