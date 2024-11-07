import { makeDbLoadAccountByToken } from "@/main/factories";
import { Middleware } from "@/presentation/protocols";
import { AuthMiddleware } from "@/presentation/middlewares";

export const makeAuthMiddleware = (): Middleware => {
  const loadAccountByToken = makeDbLoadAccountByToken();
  return new AuthMiddleware(loadAccountByToken);
};
