import bcrypt from "bcrypt"
import { describe, expect, test, jest } from "@jest/globals"
import { BcryptAdapter } from "./bcrypt-adapter"

//we do that to mock the result of a hash function, trying to basically replicate the functionality with our understanding
jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"))
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  },
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe("SignUp Controller", () => {
  test("should call hash with correct value", async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.hash("any_value")

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("should return a valid hash on hash success", async () => {
    const sut = makeSut()
    const hash = await sut.hash("any_value")

    expect(hash).toBe("hash")
  })

  test("should throw if hash throws", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error()))

    const promise = sut.hash("any_value")

    await expect(promise).rejects.toThrow() // Properly handle async code
  })

  test("should call compare with correct value", async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, "compare")
    await sut.compare("any_value", "any_hash")

    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash")
  })

  test("should return true when compare succeeds", async () => {
    const sut = makeSut()
    const isValid = await sut.compare("any_value", "any_hash")

    expect(isValid).toBe(true)
  })

  test("should return false when compare fails", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => new Promise((resolve) => resolve(false)))

    const isValid = await sut.compare("any_value", "any_hash")

    expect(isValid).toBe(false)
  })
  test("should throw if compare throws", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => Promise.reject(new Error()))

    const promise = sut.compare("any_value", "any_hash")

    await expect(promise).rejects.toThrow()
  })
})
