import { LoginTokenPayload } from 'src/types/auth/payload/login';

export type LoginSuccess = {
  success: boolean;
  loginToken: LoginTokenPayload;
};

export type LoginSuccessData = {
  id: string;
  name: string;
  email: string;
  refresh_token: string;
  access_token: string;
};
