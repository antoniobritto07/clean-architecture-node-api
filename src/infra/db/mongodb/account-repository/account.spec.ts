import { MongoHelper } from "../helpers/mongo-helper"
import { describe, expect, test, beforeAll, afterAll } from "@jest/globals"
import { AccountMongoRepository } from "./account"

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test("should return an if of the account created on success", async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    })
    expect(account).toHaveProperty("_id")

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
  })
})
