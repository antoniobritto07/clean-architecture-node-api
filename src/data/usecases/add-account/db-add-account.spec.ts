import { describe, expect, test, jest } from "@jest/globals"
import { DbAddaccount } from "./db-add-account"
import { Encrypter } from "../../protocols/encrypter"

interface SutTypes {
  sut: DbAddaccount
  encryptStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): any => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddaccount(encrypterStub) //dependency injection

  return { sut, encrypterStub }
}

describe("DbAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })

  // this test is to make sure that any try-catch will be added to the add method we have,
  // making sure that if any error pops up, the error will be passed through to the Presentation layer,
  // where there the error will be treated and returned as a Server Error.
  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )
    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
