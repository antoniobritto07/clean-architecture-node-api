import request from "supertest"
import app from "../config/app"
import { describe, test } from "@jest/globals"

//we use the body-parser because by default, post and put routes don't know how to parse JSON
describe("Body Parser Middleware", () => {
  test("should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post("/test_body_parser")
      .send({ name: "Antonio" })
      .expect({ name: "Antonio" })
  })

  // Add more tests for other routes here...
})
