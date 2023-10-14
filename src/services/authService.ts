import jwt from 'jsonwebtoken';
import UUIDService from './../services/uuidService';
import { Token } from '../types/token';
import { InvalidTokenException } from '../exceptions/auth/InvalidToken';
import { FetchOrGenerateTokenDTO } from '../controllers/dtos/authDTOs/fetchOrGenerateTokenDTO';
import { RenewTokenDTO } from '../controllers/dtos/authDTOs/renewTokenDTO';
import UserRepository from '../repositories/userRepository';
import { OnBoardDTO } from '../controllers/dtos/authDTOs/onBoardDTO';
import UserService from './userService';
class AuthService {
  /**
   * accessToken과 refreshToken 발급 및 User onboarding
   * */
  public async onBoard({
    nickname,
    gender,
    birth,
    location,
    interests,
    purpose,
  }: OnBoardDTO): Promise<Token> {
    try {
      /**
       * request body validation
       * */
      //validate nickname
      UserService.validateNickname(nickname);

      //validate birth
      UserService.validateBirth(birth);

      //validate location
      UserService.validateLocation(location);

      //validate gender
      UserService.validateGender(gender);

      //validate interests
      UserService.validateInterests(interests);

      //validate purpose
      UserService.validatePurpose(purpose);

      //onBoarding
      const id = UUIDService.generateUUID();

      const { accessToken, refreshToken } = this.generateTokens(id);

      await UserRepository.create({
        id,
        nickname,
        socketId: 'TBD',
        refreshToken,
        gender,
        birth,
        location: Array.from(new Set(location)),
        interests: Array.from(new Set(interests)),
        purpose,
        bans: [],
        reported: 0,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * accessToken과 refreshToken 갱신
   * */
  public async signIn({ userId }: FetchOrGenerateTokenDTO): Promise<Token> {
    try {
      const { accessToken: newAccessToken, refreshToken } =
        this.generateTokens(userId);

      //User DB의 refreshToken을 갱신
      await UserRepository.update({ id: userId, refreshToken });

      return { accessToken: newAccessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 세션 유지를 위해 refreshToken을 이용해서
   * accessToken과 refreshToken 갱신
   */
  public async renew({ refreshToken, userId }: RenewTokenDTO): Promise<Token> {
    try {
      const { refreshToken: foundRefreshToken } =
        await UserRepository.findById(userId);

      //refreshToken validation
      if (foundRefreshToken !== refreshToken) {
        throw new InvalidTokenException();
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.renewToken(refreshToken);

      await UserRepository.update({
        id: userId,
        refreshToken: newRefreshToken,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  public generateTokens(userId: string): Token {
    const ISS = process.env.HAZE_API_ISSUER;
    const API_KEY = process.env.HAZE_API_KEY;

    try {
      const accessToken = jwt.sign({ userId, iss: ISS }, API_KEY, {
        expiresIn: '30m',
      });
      const refreshToken = jwt.sign({ userId, iss: ISS }, API_KEY, {
        expiresIn: '30d',
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public renewToken(refreshToken: string): Token {
    const API_KEY = process.env.HAZE_API_KEY;

    try {
      const { userId, iss } = jwt.verify(refreshToken, API_KEY) as any;

      const newAccessToken = jwt.sign({ userId, iss }, API_KEY, {
        expiresIn: '30m',
      });
      const newRefreshToken = jwt.sign({ userId, iss }, API_KEY, {
        expiresIn: '30d',
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  public verifyToken(token: string): boolean {
    const API_KEY = process.env.HAZE_API_KEY;

    try {
      jwt.verify(token, API_KEY) as any;

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
