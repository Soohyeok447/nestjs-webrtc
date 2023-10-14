export class Exception extends Error {
  name: string;
  code: number;
  message: string;

  constructor({ name, message, code }) {
    super();
    this.name = name;
    this.message = message;
    this.code = code;
  }
}
