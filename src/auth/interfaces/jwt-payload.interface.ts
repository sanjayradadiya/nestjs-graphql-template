import { UserType } from '../enum/user-type.enums';

/**
 * This interface represents the payload data structure that is used to generate jwt token
 */
export interface JwtPayload {
  userId: string;
  username: string;
  refresh_token: string;
}
