export class UnauthorizedError extends Error {
  constructor() {
    super(`Unathorized`)
    this.name = "Server Error"
  }
}
