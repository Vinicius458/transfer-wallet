export class TransferSameAccountError extends Error {
  constructor() {
    super("Cannot transfer to the same account");
    this.name = "TransferSameAccountError";
  }
}
