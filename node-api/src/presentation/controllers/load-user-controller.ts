import { Controller, HttpResponse, Validation } from "@/presentation/protocols";
import { badRequest, serverError, ok } from "@/presentation/helpers";
import { LoadUserByEmail } from "@/domain/usecases";

export class LoadUserController implements Controller {
  constructor(
    private readonly loadUserUseCase: LoadUserByEmail,
    private readonly validation: Validation
  ) {}

  async handle(request: LoadUserController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const user = await this.loadUserUseCase.load(request.email);
      return ok(user);
    } catch (error: any) {
      return serverError(error);
    }
  }
}

export namespace LoadUserController {
  export type Request = {
    email: string;
  };
}
