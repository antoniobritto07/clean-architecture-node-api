export class MissingParamError extends Error {
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`) //classes that inherit from Error in JS need to be called SUPER
    this.name = "MissingParamError" //it's a good practise set the this.name as the name of the class itself
  }
}
