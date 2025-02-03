import request from "supertest"
import app from "../config/app"
import { Collection } from "mongodb"
import { describe, test, beforeAll, afterAll, beforeEach } from "@jest/globals"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"

let accountCollection: Collection
describe("SignUp Routes", () => {
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
  test("should return 200 on sign up success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Antonio",
        email: "antonio.britto@gmail.com",
        password: "123",
        passwordConfirmation: "123",
      })
      .expect(200)
  })
})
