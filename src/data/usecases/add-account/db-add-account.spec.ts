import { describe, expect, test, jest } from "@jest/globals"
import { DbAddAccount } from "./db-add-account"
import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./db-add-account-protocols"

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "hashed_password",
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
})

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub) //dependency injection

  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe("DbAddAccount Usecase", () => {
  test("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
    await sut.add(makeFakeAccountData())
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
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test("should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@email.com",
      password: "hashed_password",
    })
  })

  test("should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      )
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  //normally, in successes cases, we don't need to mock anything.
  //mock is more used when we need to perform a strange/error/exception case
  test("should return an account on success", async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
