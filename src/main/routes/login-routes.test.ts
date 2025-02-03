import request from "supertest"
import app from "../config/app"
import { describe, test, beforeAll, afterAll, beforeEach } from "@jest/globals"
import { Collection } from "mongodb"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import { hash } from "bcrypt"

let accountCollection: Collection
describe("Login Routes", () => {
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
  test("should return 200 on login", async () => {
    const password = await hash("123", 12)
    await accountCollection.insertOne({
      name: "Antonio",
      email: "antonio.britto@gmail.com",
      password,
    })
    await request(app)
      .post("/api/login")
      .send({
        email: "antonio.britto@gmail.com",
        password: "123",
      })
      .expect(200)
  })

  test("should return 401 on login", async () => {
    await request(app)
      .post("/api/login")
      .send({
        email: "antonio.britto@gmail.com",
        password: "123",
      })
      .expect(401)
  })
})
