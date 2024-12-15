import { describe, expect, test, jest } from "@jest/globals"
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
} from "./signup-protocols"
import { SignUpController } from "./signup"
import { ServerError, InvalidParamError, MissingParamError } from "../../errors"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    //this isn't a production class, we're injecting a EmailValidator mocked version into our controller
    isValid(email: string): boolean {
      //Stub is one Mock type, and basically we attribute an direct value for a function, as in this case (since we're returning true directly)
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
      }
      return new Promise((resolve) => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub) //example of dependency injection

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  }
}
describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", async () => {
    const { sut } = makeSut() //sut means System Under Test
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("name"))
  })

  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
  })

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("password"))
  })

  test("should return 400 if no password confirmation is provided", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation"),
    )
  })

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut()
    //manually mocking the stub default return value to force it fail, and then test the functionality
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError("email"))
  })

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com")
  })

  test("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    //manually mocking the stub default isValid implementation to make it return an error
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test("should return 400 if password confirmation fails", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "invalid_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation"),
    )
  })

  test("should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, "add")
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    await sut.handle(httpRequest)
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

    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
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
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    })
  })
})
