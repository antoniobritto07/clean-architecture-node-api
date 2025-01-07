import { describe, expect, test, jest } from "@jest/globals"
import { DbAddaccount } from "./db-add-account"

describe("DbAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_password"))
      }
    }
    const encryptStub = new EncrypterStub()
    const sut = new DbAddaccount(encryptStub) //dependency injection
    const encryptSpy = jest.spyOn(encryptStub, "encrypt")
    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })
})
