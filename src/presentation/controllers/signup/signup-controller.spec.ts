import { describe, expect, test, jest } from "@jest/globals"
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation,
} from "./signup-controller-protocols"
import { SignUpController } from "./signup-controller"
import { ServerError, MissingParamError } from "../../errors"
import { ok, serverError, badRequest } from "../../helpers/http/http-helper"

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub) //example of dependency injection

  return {
    sut,
    addAccountStub,
    validationStub,
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
})

describe("SignUp Controller", () => {
  test("should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, "add")
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    })
  })

  test("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test("should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })
})
