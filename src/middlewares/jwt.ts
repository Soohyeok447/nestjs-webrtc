import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';
import { InvalidTokenException } from '../exceptions/auth/InvalidTokenException';
import { MissingTokenException } from '../exceptions/auth/MissingTokenException';
import { JwtPayload } from '../types/jwtPayload';
import { TokenExpiredException } from '../exceptions/auth/TokenExpiredException';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const API_KEY = process.env.HAZE_API_KEY;

  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json(new MissingTokenException());
  }

  try {
    const decoded: JwtPayload = verify(accessToken, API_KEY) as any;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json(new InvalidTokenException());
    }

    if (error instanceof TokenExpiredError) {
      return res.status(401).json(new TokenExpiredException());
    }

    return res.status(401).json(new Error(`${error.toString()} 에러 발생`));
  }
};
