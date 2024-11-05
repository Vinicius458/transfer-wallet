export interface Deposit {
  execute: (data: Deposit.Params) => Promise<void>;
}

export namespace Deposit {
  export type Params = {
    accountId: string;
    amount: number;
  };
}
