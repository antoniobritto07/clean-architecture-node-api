import bcrypt from "bcrypt"
import { describe, expect, test, jest } from "@jest/globals"
import { BcryptAdapter } from "./bcrypt-adapter"

describe("SignUp Controller", () => {
  test("should call bcrypt with correct value", async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.encrypt("any_value")

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })
})
