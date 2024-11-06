export default interface UserInterface {
  get id(): string;
  set id(key: string);
  get name(): string;
  get email(): string;
  set password(hash: string);
  get password(): string;
  set token(key: string);
  get token(): string;
}
