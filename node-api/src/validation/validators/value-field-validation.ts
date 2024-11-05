import { Validation } from "@/presentation/protocols";
import { ValueSmallerZeroError } from "@/presentation/errors/value-smaller-zero-error";

export class ValueFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error | undefined {
    if (typeof input[this.fieldName] !== "number" || input[this.fieldName] <= 0)
      return new ValueSmallerZeroError(this.fieldName);
  }
}
