import request from "supertest"
import app from "../config/app"
import { describe, test, beforeAll, afterAll, beforeEach } from "@jest/globals"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })
  test("should return an account on success", async () => {
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
