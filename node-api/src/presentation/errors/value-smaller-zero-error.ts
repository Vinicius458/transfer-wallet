export class ValueSmallerZeroError extends Error {
  constructor(field: string) {
    super(`${field}amount must be greater than zero`);
    this.name = "ValueSmallerZeroError";
  }
}
