import { DbAuthentication } from "@/data/usecases";
import {
  HashComparer,
  Encrypter,
  UserRepositoryInterface,
} from "@/data/protocols";
import User from "@/domain/entities/user/user";

const makeSut = () => {
  const user = new User("any_name", "any_email@mail.com");
  user.id = "any_id";
  user.password = "hashed_password";
  const userRepositoryStub: jest.Mocked<UserRepositoryInterface> = {
    loadByEmail: jest.fn().mockResolvedValueOnce(user),
    add: jest.fn(),
    checkByEmail: jest.fn(),
    find: jest.fn(),
    loadByToken: jest.fn(),
    updateAccessToken: jest.fn(),
  };

  const hashComparerStub: jest.Mocked<HashComparer> = {
    compare: jest.fn(),
  };

  const encrypterStub: jest.Mocked<Encrypter> = {
    encrypt: jest.fn(),
  };

  const sut = new DbAuthentication(
    userRepositoryStub,
    hashComparerStub,
    encrypterStub
  );

  return {
    sut,
    userRepositoryStub,
    hashComparerStub,
    encrypterStub,
  };
};

// Testes
describe("DbAuthentication", () => {
  it("Should call loadByEmail with the correct email", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(userRepositoryStub, "loadByEmail");

    await sut.auth({ email: "any_email@mail.com", password: "any_password" });

    expect(loadByEmailSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("Should return null if loadByEmail return null", async () => {
    const { sut, userRepositoryStub } = makeSut();
    userRepositoryStub.loadByEmail.mockResolvedValueOnce(null);

    const result = await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    });

    expect(result).toBeNull();
  });

  it("Should call HashComparer with the correct values", async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    await sut.auth({ email: "any_email@mail.com", password: "any_password" });

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  it("Should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();

    hashComparerStub.compare.mockResolvedValueOnce(false);

    const result = await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    });

    expect(result).toBeNull();
  });

  it("Should call Encrypter with user ID", async () => {
    const { sut, encrypterStub, hashComparerStub } = makeSut();

    hashComparerStub.compare.mockResolvedValueOnce(true);
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    await sut.auth({ email: "any_email@mail.com", password: "any_password" });

    expect(encryptSpy).toHaveBeenCalledWith("any_id");
  });

  it("Should call updateAccessToken with the correct values", async () => {
    const { sut, userRepositoryStub, hashComparerStub, encrypterStub } =
      makeSut();

    hashComparerStub.compare.mockResolvedValueOnce(true);
    encrypterStub.encrypt.mockResolvedValueOnce("any_token");
    const updateAccessTokenSpy = jest.spyOn(
      userRepositoryStub,
      "updateAccessToken"
    );

    await sut.auth({ email: "any_email@mail.com", password: "any_password" });

    expect(updateAccessTokenSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  it("Should return the accessToken and username on success", async () => {
    const { sut, hashComparerStub, encrypterStub } = makeSut();

    hashComparerStub.compare.mockResolvedValueOnce(true);
    encrypterStub.encrypt.mockResolvedValueOnce("any_token");

    const result = await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    });

    expect(result).toEqual({
      accessToken: "any_token",
      name: "any_name",
    });
  });
});
