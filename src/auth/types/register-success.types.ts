export type RegisterSuccess = {
  message: string;
  data: RegisterSuccessData;
};

export type RegisterSuccessData = {
  id: string;
  name: string;
  email: string;
  mobile_number: number;
  refresh_token: string;
  access_token: string;
};
