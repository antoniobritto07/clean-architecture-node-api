import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { LogMongoRepository } from "./log-mongo-repository"
import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals"

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}
describe("Log Mongo Repository", () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors")
    await errorCollection.deleteMany({})
  })
  test("should create an error log on success", async () => {
    const sut = makeSut()
    await sut.logError("any_error")
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
