import { describe, expect, test, jest } from "@jest/globals"
import { DbAddAccount } from "./db-add-account"
import {
  AccountModel,
  AddAccountModel,
  Hasher,
} from "./db-add-account-protocols"

import { AddAccountRepository } from "../../protocols/db/account/add-account-repository"

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }
  return new HasherStub()
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
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub) //dependency injection

  return { sut, hasherStub, addAccountRepositoryStub }
}

describe("DbAddAccount Usecase", () => {
  test("should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, "hash")
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })

  // this test is to make sure that any try-catch will be added to the add method we have,
  // making sure that if any error pops up, the error will be passed through to the Presentation layer,
  // where there the error will be treated and returned as a Server Error.
  test("should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, "hash")
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
