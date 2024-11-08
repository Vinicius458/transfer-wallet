import { Controller, HttpResponse, Validation } from "@/presentation/protocols";
import { badRequest, serverError, ok, forbidden } from "@/presentation/helpers";
import { EmailInUseError } from "@/presentation/errors";
import { AddUser, Authentication } from "@/domain/usecases";

export class SignUpController implements Controller {
  constructor(
    private readonly addUser: AddUser,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = request;
      const isValid = await this.addUser.add({
        name,
        email,
        password,
      });
      if (!isValid) {
        return forbidden(new EmailInUseError());
      }
      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });
      return ok(authenticationModel);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}
