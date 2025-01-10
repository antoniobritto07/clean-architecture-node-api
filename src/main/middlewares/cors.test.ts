import request from "supertest"
import app from "../config/app"
import { describe, test } from "@jest/globals"

describe("CORS Middleware", () => {
  test("should allow request from outside the application without further problems", async () => {
    app.get("/test_cors", (req, res) => {
      res.send()
    })
    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*")
  })
})
