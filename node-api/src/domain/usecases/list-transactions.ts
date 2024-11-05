import { TransactionType } from "../entities";

export interface ListTransactions {
  execute: () => Promise<ListTransactions.Result>;
}

export namespace ListTransactions {
  export type Result = Array<{
    id: string;
    accountId: string;
    amount: number;
    type: TransactionType;
    targetAccountId?: string;
    createdAt: Date;
  }>;
}
