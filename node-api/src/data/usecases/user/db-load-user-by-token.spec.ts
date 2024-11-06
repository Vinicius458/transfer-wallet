import { DbLoadUserByToken } from "./db-load-user-by-token";
import { Decrypter, UserRepositoryInterface } from "@/data/protocols";

const makeDecrypter = (): Decrypter => {
  return {
    decrypt: jest.fn(),
  };
};

const makeUserRepository = (): UserRepositoryInterface => {
  return {
    loadByEmail: jest.fn(),
    add: jest.fn(),
    checkByEmail: jest.fn(),
    find: jest.fn(),
    loadByToken: jest.fn(),
    updateAccessToken: jest.fn(),
  };
};

type SutTypes = {
  sut: DbLoadUserByToken;
  decrypterStub: Decrypter;
  userRepositoryStub: UserRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const userRepositoryStub = makeUserRepository();
  const sut = new DbLoadUserByToken(decrypterStub, userRepositoryStub);
  return { sut, decrypterStub, userRepositoryStub };
};

describe("DbLoadUserByToken UseCase", () => {
  test("should call Decrypter with the correct token", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    const accessToken = "valid_token";

    await sut.load(accessToken);

    expect(decryptSpy).toHaveBeenCalledWith(accessToken);
  });

  test("should return null if Decrypter throws an error", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await sut.load("invalid_token");

    expect(result).toBeNull();
  });

  test("should return null if Decrypter returns a falsy value", async () => {
    const { sut } = makeSut();
    const result = await sut.load("any_token");

    expect(result).toBeNull();
  });

  test("should call UserRepository with the correct token if Decrypter succeeds", async () => {
    const { sut, decrypterStub, userRepositoryStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockResolvedValueOnce("decrypted_token");
    const loadByTokenSpy = jest.spyOn(userRepositoryStub, "loadByToken");

    await sut.load("valid_token");

    expect(loadByTokenSpy).toHaveBeenCalledWith("valid_token");
  });

  test("should return null if UserRepository returns null", async () => {
    const { sut, decrypterStub, userRepositoryStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockResolvedValueOnce("decrypted_token");
    jest.spyOn(userRepositoryStub, "loadByToken").mockResolvedValueOnce(null);

    const result = await sut.load("valid_token");

    expect(result).toBeNull();
  });

  test("should return the user id if UserRepository returns a valid user", async () => {
    const { sut, decrypterStub, userRepositoryStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockResolvedValueOnce("decrypted_token");
    jest
      .spyOn(userRepositoryStub, "loadByToken")
      .mockResolvedValueOnce("user_id");

    const result = await sut.load("valid_token");

    expect(result).toEqual({ id: "user_id" });
  });
});
