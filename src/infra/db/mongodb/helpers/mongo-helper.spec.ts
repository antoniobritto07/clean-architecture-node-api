import { MongoHelper as sut } from "../helpers/mongo-helper"
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test("should reconnect if mongodb is down", async () => {
    let accountCollection = await sut.getCollection("accounts")
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection("accounts")
    expect(accountCollection).toBeTruthy()
  })
})
