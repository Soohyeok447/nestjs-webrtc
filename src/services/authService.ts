import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { Token } from '../types/token';

export const generateTokens = (): Token => {
  const userId: string = v4();
  const ISS = process.env.HAZE_API_ISSUER;
  const API_KEY = process.env.HAZE_API_KEY;

  try {
    const accessToken = jwt.sign({ userId, iss: ISS }, API_KEY, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ userId, iss: ISS }, API_KEY, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error.toString();
  }

}

export const renewToken = (refreshToken: string): { accessToken: string } => {
  const API_KEY = process.env.HAZE_API_KEY;

  try {
    const { userId, iss } = jwt.verify(refreshToken, API_KEY) as any;

    const accessToken = jwt.sign({ userId, iss }, API_KEY, { expiresIn: '30m' });

    return { accessToken };
  } catch (error) {
    throw error.toString();;
  }
};

export const verifyToken = (accessToken: string): boolean => {
  const API_KEY = process.env.HAZE_API_KEY;

  try {
    jwt.verify(accessToken, API_KEY) as any;

    return true;
  } catch (error) {
    return false;
  }
}