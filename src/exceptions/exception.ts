export class Exception extends Error {
  code: number;
  message: string;

  constructor({ message, code }) {
    super();
    this.message = message;
    this.code = code;
  }
}