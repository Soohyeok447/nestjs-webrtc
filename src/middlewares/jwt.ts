import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { InvalidTokenException } from '../exceptions/auth/InvalidToken';
import { NotFoundTokenException } from '../exceptions/auth/NotFoundToken';


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const API_KEY = process.env.HAZE_API_KEY;

  const accessToken = req.headers['authorization']?.split(' ')[1];

  console.log("1차")


  if (!accessToken) {
    return res.status(401).json(NotFoundTokenException);
  }

  try {
    const decoded = jwt.verify(accessToken, API_KEY) as any;

    req["user"] = decoded;

    next();
  } catch (error) {
    return res.status(401).json(InvalidTokenException);
  }
};