import type { Config } from "jest"

const config: Config = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  // testMatch: ["**/*.spec.ts"],  "test" will run only the integration tests, whereas "spec" will run all the unit tests
  coverageDirectory: "coverage",
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
}

export default config
