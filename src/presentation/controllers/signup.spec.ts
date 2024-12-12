import { describe, expect, test } from "@jest/globals"
import { SignUpController } from "./signup"
describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = new SignUpController()
    const httpRequest = {
      email: "any_email@email.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse).toHaveProperty("statusCode")
    expect(httpResponse.body).toEqual(new Error("Missing param: name"))
  })
})
