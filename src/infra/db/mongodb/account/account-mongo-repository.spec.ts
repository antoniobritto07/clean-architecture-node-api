import { MongoHelper } from "../helpers/mongo-helper"
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals"
import { AccountMongoRepository } from "./account-mongo-repository"
import { Collection } from "mongodb"

let accountCollection: Collection
describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  //when dealing with integration tests we don't have the freedom that we were used to have, to test exceptions and other different behaviors.
  test("should return an account on add success", async () => {
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

  test("should return an account on loadByEmail success", async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    })
    const account = await sut.loadByEmail("any_email@mail.com")

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
  })

  test("should return null if loadByEmail fails", async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail("any_email@mail.com")
    expect(account).toBeFalsy()
  })

  test("should update the account accessToken on updateAccessToken success", async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    })

    const insertedId = res.insertedId.toString()

    await sut.updateAccessToken(insertedId, "any_token")
    const account = await accountCollection.findOne({ _id: res.insertedId })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe("any_token")
  })
})
