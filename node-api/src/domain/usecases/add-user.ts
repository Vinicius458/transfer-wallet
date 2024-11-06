export interface AddUser {
  add: (account: AddUser.Params) => Promise<AddUser.Result>;
}

export namespace AddUser {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Result = boolean;
}
