export class ResponseError extends Error {
  constructor(
    public status: number,
    public message: string,
    public body?: object
  ) {
    super(message)
  }
}
