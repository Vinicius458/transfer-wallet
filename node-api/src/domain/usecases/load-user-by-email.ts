export interface LoadUserByEmail {
  load: (email: string) => Promise<LoadUserByEmail.Result>;
}

export namespace LoadUserByEmail {
  export type Result = {
    id: string;
  } | null;
}
