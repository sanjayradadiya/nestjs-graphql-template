import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import {
  BackendEndErrorResponseProps,
  ErrorCodeEnum,
  Extensions,
  HandledErrorProps,
} from './types';

export class BackendErrorResponse extends Error {
  public readonly message: string;
  public readonly extensions: Extensions;
  public readonly httpStatus: StatusCodes;
  constructor({
    message,
    error,
    httpStatus,
    extensions,
  }: BackendEndErrorResponseProps) {
    super(message);
    this.message = message;
    this.extensions = extensions;
    this.httpStatus = httpStatus;
    if (error) {
      this.stack = error.stack;
    } else {
      Error.captureStackTrace(this);
    }
  }
}

export class ForbiddenError extends BackendErrorResponse {
  constructor({ errorCode, message, requestId, where }: HandledErrorProps) {
    super({
      extensions: {
        errorCode: errorCode || ErrorCodeEnum.FORBIDDEN_ERROR,
        requestId,
        where,
      },
      message: message || getReasonPhrase(StatusCodes.FORBIDDEN),
    });
  }
}

export class ValidationError extends BackendErrorResponse {
  constructor({
    errorCode,
    message,
    httpStatus,
    requestId,
    where,
  }: HandledErrorProps) {
    super({
      extensions: {
        errorCode: errorCode || ErrorCodeEnum.INVALID_REQUEST_INPUT,
        requestId,
        where,
      },
      message: message || getReasonPhrase(StatusCodes.BAD_REQUEST),
      httpStatus: httpStatus || StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
export class InternalServerError extends BackendErrorResponse {
  constructor({
    errorCode,
    message,
    httpStatus,
    requestId,
    where,
  }: HandledErrorProps) {
    super({
      extensions: {
        errorCode: errorCode || ErrorCodeEnum.INVALID_REQUEST_INPUT,
        requestId,
        where,
      },
      message: message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      httpStatus: httpStatus || StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
