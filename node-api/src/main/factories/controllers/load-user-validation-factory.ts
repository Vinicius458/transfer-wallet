import {
  ValidationComposite,
  RequiredFieldValidation,
} from "@/validation/validators";
import { Validation } from "@/presentation/protocols";

export const makeLoadUserValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["userId"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
