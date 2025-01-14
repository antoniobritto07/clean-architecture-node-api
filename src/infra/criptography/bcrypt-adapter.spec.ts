import bcrypt from "bcrypt"
import { describe, expect, test, jest } from "@jest/globals"
import { BcryptAdapter } from "./bcrypt-adapter"

//we do that to mock the result of a hash function, trying to basically replicate the functionality with our understanding
jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"))
  },
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe("SignUp Controller", () => {
  test("should call bcrypt with correct value", async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.encrypt("any_value")

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("should return a hash on success", async () => {
    const sut = makeSut()
    const hash = await sut.encrypt("any_value")

    expect(hash).toBe("hash")
  })

  test("should throw if bcrypt throws", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error()))

    const promise = sut.encrypt("any_value")

    await expect(promise).rejects.toThrow() // Properly handle async code
  })
})
