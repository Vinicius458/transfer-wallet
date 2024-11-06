import { AddUser } from "@/domain/usecases";
import { AddUserUseCase } from "./add-user";
import User from "@/domain/entities/user/user";
import { UserRepositoryInterface } from "@/data/protocols/db/user/user-repository.interface";
import { Hasher } from "@/data/protocols";

export const mockUserParams = () => ({
  name: "Joao",
  email: "joao@email.com",
  password: "senha123",
});

const HasherMock = (): jest.Mocked<Hasher> => {
  return {
    hash: jest.fn().mockResolvedValue("sh88hs3h9os"),
  };
};
const UserMockRepository = (): jest.Mocked<UserRepositoryInterface> => {
  return {
    find: jest.fn(),
    add: jest.fn().mockResolvedValue("hvtvbyvy"),
    checkByEmail: jest.fn().mockImplementation(() => Promise.resolve(false)),
    loadByEmail: jest.fn(),
    loadByToken: jest.fn(),
    updateAccessToken: jest.fn(),
  };
};

type SutTypes = {
  sut: AddUser;
  hasherMock: jest.Mocked<Hasher>;
  userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
};

const makeSut = (): SutTypes => {
  const hasherMock = HasherMock();
  const userRepositoryMock = UserMockRepository();
  const sut = new AddUserUseCase(hasherMock, userRepositoryMock);
  return {
    sut,
    hasherMock,
    userRepositoryMock,
  };
};

describe("Unit test AddUser use case", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherMock } = makeSut();
    const addUserParams = mockUserParams();
    const hashSpy = jest.spyOn(hasherMock, "hash");
    await sut.add(addUserParams);
    expect(hashSpy).toHaveBeenCalledWith(addUserParams.password);
  });
  test("Should throw if Hasher throws", async () => {
    const { sut, hasherMock } = makeSut();
    jest.spyOn(hasherMock, "hash").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.add(mockUserParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddUserRepository with correct values", async () => {
    const { sut, userRepositoryMock } = makeSut();
    const addUserParams = mockUserParams();
    const userSpy = jest.spyOn(userRepositoryMock, "add");

    await sut.add(addUserParams);
    const user = new User(addUserParams.name, addUserParams.email);
    user.password = "sh88hs3h9os";
    expect(userSpy).toHaveBeenCalledWith(user);
  });

  test("Should throw if AddUserRepository throws", async () => {
    const { sut, userRepositoryMock } = makeSut();
    jest.spyOn(userRepositoryMock, "add").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.add(mockUserParams());
    await expect(promise).rejects.toThrow();
  });

  test("Should return true on success", async () => {
    const { sut } = makeSut();
    const isValid = await sut.add(mockUserParams());
    expect(isValid).toBe(true);
  });

  test("Should return false if CheckUserByEmailRepository returns true", async () => {
    const { sut, userRepositoryMock } = makeSut();
    jest.spyOn(userRepositoryMock, "checkByEmail").mockResolvedValue(true);
    const isValid = await sut.add(mockUserParams());
    expect(isValid).toBe(false);
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, userRepositoryMock } = makeSut();
    const addUserParams = mockUserParams();
    const checkByEmail = jest.spyOn(userRepositoryMock, "checkByEmail");
    await sut.add(addUserParams);
    expect(checkByEmail).toHaveBeenCalledWith(addUserParams.email);
  });
});
