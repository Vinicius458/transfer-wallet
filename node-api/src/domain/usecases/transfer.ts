export interface Transfer {
  execute(data: Transfer.Params): Promise<void>;
}

export namespace Transfer {
  export type Params = {
    accountId: string;
    targetAccountId: string;
    amount: number;
  };
}
