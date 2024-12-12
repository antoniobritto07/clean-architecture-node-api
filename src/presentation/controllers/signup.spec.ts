import { describe, expect, test } from "@jest/globals"
import { SignUpController } from "./signup"
import { MissingParamError } from "../errors/missing-param-error"

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = new SignUpController() //sut means System Under Test
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toHaveProperty("statusCode")
    expect(httpResponse.body).toEqual(new MissingParamError("name"))
  })

  test("should return 400 if no email is provided", () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toHaveProperty("statusCode")
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
  })
})
