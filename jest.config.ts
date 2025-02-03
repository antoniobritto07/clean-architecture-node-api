import type { Config } from "jest"

const config: Config = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
  //"test" will run only the integration tests, whereas "spec" will run all the unit tests
  testMatch: ["**/*.test.ts"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
}

export default config
