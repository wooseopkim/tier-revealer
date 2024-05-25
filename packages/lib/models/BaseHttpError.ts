import BaseError from './BaseError';

export default class BaseHttpError extends Error implements BaseError {
  code: string;
  message: string;

  constructor(res: Response, code: string) {
    super();
    this.code = code;
    this.message = `[${res.status} ${res.statusText}] ${res.text()}`;
  }
}
