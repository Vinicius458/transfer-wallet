export class TypeTransactionError extends Error {
  constructor() {
    super("Invalid transaction type");
    this.name = "TypeTransactionError";
  }
}
