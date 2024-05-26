import type BaseError from './BaseError';

export default class BaseHttpError extends Error implements BaseError {
  code: string;
  message: string;

  static async from(res: Response, code: string) {
    const message = `[${res.status} ${res.statusText}] ${await res.text()}`;
    return new BaseHttpError(code, message);
  }

  protected constructor(code: string, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}
