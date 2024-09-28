import { StatusCodes } from 'http-status-codes';
import { CustomOverride } from '../utils';

export enum ErrorCodeEnum {
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_REQUEST_INPUT = 'INVALID_REQUEST_INPUT',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
  UNDEFINED = 'UNDEFINED',
  UNSUPPORTED_SORT = 'UNSUPPORTED_SORT',
  UNSUPPORTED_FILTER = 'UNSUPPORTED_FILTER',
}

export type Extensions = {
  /** Standard error code defined internally. */
  readonly errorCode?: ErrorCodeEnum;
  /** Request identifier. */
  readonly requestId?: string;
  readonly where?: string;
};

export type BackendEndErrorResponseProps = {
  /**
   * A message that would be sent in the response and would be made visible to the client.
   * Always get it reviewed before writing any text for this field.
   */
  readonly message: string;
  /** It is a way of passing error object to override the auto created stacktrace */
  readonly error?: Error | undefined;
  /**
   * An object that contains more information about the error. Aimed at the developer consuming the API
   */
  readonly extensions: Extensions;
  readonly httpStatus?: StatusCodes;
};

export type ErrorProps = {
  /**
   * A message that would be sent in the response and would be made visible to the client.
   * Always get it reviewed before writing any text for this field.
   */
  readonly message: string;
  /** It could be one of the standard error code defined by the ErrorCodeEnum */
  readonly errorCode: ErrorCodeEnum;
  /** A field that describes to what should be the HTTP status code of the response for this request. */
  readonly httpStatus: StatusCodes;
  /**
   * The value should be set from AsyncLocalStorage or userContext
   */
  readonly requestId?: string;
  /**
   * This field should contain the name of the function and the file where this error was thrown.
   */
  readonly where: string;
};

export type HandledErrorProps = CustomOverride<
  ErrorProps,
  {
    errorCode?: ErrorCodeEnum;
    httpStatus?: StatusCodes;
  }
>;
