import { Express, Router } from "express"
//to get all the route files dynamically, we're using the lib fast-glob
import fg from "fast-glob"

export default (app: Express): void => {
  const router = Router()
  app.use("/api", router) // determine a prefix for all the routes
  fg.sync("**/src/main/routes/**routes.ts").map(async (file) =>
    (await import(`../../../${file}`)).default(router),
  )
}
