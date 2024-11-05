export interface ListAccounts {
  execute: () => Promise<ListAccounts.Result>;
}

export namespace ListAccounts {
  export type Result = Array<{
    accountId: string;
    ballance: number;
  }>;
}
