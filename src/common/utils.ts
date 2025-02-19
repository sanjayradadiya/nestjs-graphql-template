export type CustomOverride<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
