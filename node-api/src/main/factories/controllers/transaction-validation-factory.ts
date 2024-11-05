import {
  RequiredFieldValidation,
  TransactionTypeValidation,
  ValidationComposite,
  ValueFieldValidation,
} from "@/validation/validators";
import { Validation } from "@/presentation/protocols";

export const makeTransactionValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ["type", "accountId", "amount"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new TransactionTypeValidation("type"));
  validations.push(new ValueFieldValidation("amount"));
  return new ValidationComposite(validations);
};
