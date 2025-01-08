import bcrypt from "bcrypt"
import { describe, expect, test, jest } from "@jest/globals"
import { BcryptAdapter } from "./bcrypt-adapter"

//we do that to mock the result of a hash function, trying to basically replicate the functionality with our understanding
jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"))
  },
}))

describe("SignUp Controller", () => {
  test("should call bcrypt with correct value", async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.encrypt("any_value")

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("should return a hash on success", async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt("any_value")

    expect(hash).toBe("hash")
  })
})
