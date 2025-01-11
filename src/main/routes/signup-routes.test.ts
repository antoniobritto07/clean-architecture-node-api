import request from "supertest"
import app from "../config/app"
import { describe, test } from "@jest/globals"

describe("SignUp Routes", () => {
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
