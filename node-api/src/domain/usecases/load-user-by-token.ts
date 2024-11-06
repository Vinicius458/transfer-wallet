export interface LoadUserByToken {
  load: (accessToken: string) => Promise<LoadUserByToken.Result>;
}

export namespace LoadUserByToken {
  export type Result = {
    id: string;
  } | null;
}
