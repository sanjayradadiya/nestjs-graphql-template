export interface ForgotPasswordInput {
  email: string;
}

export interface SetPasswordInput {
  token: string;
  password: string;
}

export interface VerifySetPasswordInput {
  token: string;
}

export type LoginUserInput = {
  email: string;
  password: string;
};
