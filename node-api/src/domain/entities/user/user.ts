import UserInterface from "./user.interface";

export default class User implements UserInterface {
  private _id: string;
  private _password: string;
  private _token: string;
  constructor(
    private _name: string,
    private _email: string
  ) {}

  set id(key: string) {
    this._id = key;
  }
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }
  set password(hash: string) {
    this._password = hash;
  }

  get password(): string {
    return this._password;
  }

  set token(key: string) {
    this._token = key;
  }
  get token(): string {
    return this._token;
  }
}
