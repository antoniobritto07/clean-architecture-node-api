import { describe, expect, test, jest } from "@jest/globals"
import { DbAddaccount } from "./db-add-account"
import { Encrypter } from "../../protocols/encrypter"

interface SutTypes {
  sut: DbAddaccount
  encryptStub: Encrypter
}
const makeSut = (): any => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }
  const encrypterStub = new EncrypterStub()
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
})
