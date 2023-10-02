declare namespace Express {
  export interface Request {
    userId?: string;
    socketId?: string;
  }
}