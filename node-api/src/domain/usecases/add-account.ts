export interface AddAccount {
  execute: (account: AddAccount.Params) => Promise<AddAccount.Result>;
}

export namespace AddAccount {
  export type Params = {
    accountId: string;
    balance: number;
  };

  export type Result = {
    accountId: string;
  };
}
