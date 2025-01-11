import { MongoHelper } from "../helpers/mongo-helper"
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals"
import { AccountMongoRepository } from "./account"

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  //when dealing with integration tests we don't have the freedom that we were used to have, to test exceptions and other different behaviors.
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
