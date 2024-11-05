import { Validation } from "@/presentation/protocols";
import { TransactionType } from "@/domain/entities";
import { TypeTransactionError } from "@/presentation/errors/type-transaction-error";

export class TransactionTypeValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | undefined {
    const isValid = Object.values(TransactionType).includes(
      input[this.fieldName]
    );
    if (!isValid) {
      return new TypeTransactionError();
    }
  }
}
