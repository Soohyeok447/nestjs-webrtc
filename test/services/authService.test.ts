import AuthService from '../../src/services/authService';
import UserRepository from '../../src/repositories/userRepository';
import ImagesRepository from '../../src/repositories/imageRepository';
import { Token } from '../../src/types/token';
import { InvalidTokenException } from '../../src/exceptions/auth/InvalidTokenException';
import { RenewTokenDTO } from '../../src/controllers/dtos/authDTOs/renewTokenDTO';
import { JsonWebTokenError } from 'jsonwebtoken';
import { OnBoardDTO } from '../../src/controllers/dtos/authDTOs/onBoardDTO';
import { MOCK_USER } from './constants';

jest.mock('../../src/repositories/userRepository');
const mockedUserRepository = UserRepository as jest.Mocked<
  typeof UserRepository
>;

//TODO 디버깅용 추후 삭제
jest.mock('../../src/repositories/imageRepository');
const mockedImagesRepository = ImagesRepository as jest.Mocked<
  typeof ImagesRepository
>;

const USER_ID = 'userID';

const VALID_TOKEN_FORM =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZjFmMTMzNy02ZDg3LTQ1YjctYTdmZi04MmViOGY1NmMzODUiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk3NDkwNzMyLCJleHAiOjE2OTc0OTI1MzJ9.Wf5QFwTsmv3TmYS8ogGNQX2CqSG1Lai_AxpjwxuYNEY';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens()', () => {
    it('should generate tokens when valid userId is provided', () => {
      const tokens: Token = AuthService.generateTokens(USER_ID);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });
  });

  describe('renewToken()', () => {
    it('should renew tokens when valid refreshToken is provided', () => {
      const { refreshToken }: Token = AuthService.generateTokens(USER_ID);

      const tokens: Token = AuthService.renewToken(refreshToken);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should throw JsonWebTokenError when malformed refreshToken is provided', () => {
      const invalidRefreshToken = 'refreshToken';

      try {
        AuthService.renewToken(invalidRefreshToken);
      } catch (error) {
        expect(error instanceof JsonWebTokenError);
      }
    });

    it('should throw JsonWebTokenError when invalid signature refreshToken is provided', () => {
      try {
        AuthService.renewToken(VALID_TOKEN_FORM);
      } catch (error) {
        expect(error instanceof JsonWebTokenError);
      }
    });
  });

  describe('verifyToken()', () => {
    it('should return true when valid token is provided', () => {
      const { accessToken }: Token = AuthService.generateTokens(USER_ID);

      const result: boolean = AuthService.verifyToken(accessToken);

      expect(result).toEqual(true);
    });

    it('should return false when invalid token is provided', () => {
      const invalid_token = 'token';

      const testData = [invalid_token, VALID_TOKEN_FORM];

      testData.forEach((token) => {
        const result = AuthService.verifyToken(token);

        expect(result).toEqual(false);
      });
    });
  });

  describe('onBoard()', () => {
    it('should return tokens when valid onboard data is provided', async () => {
      const onBoardDTO: OnBoardDTO = {
        gender: 'MALE',
        nickname: 'test',
        location: ['경기'],
        birth: '2000-01-01',
        purpose: '진지한연애',
        interests: ['PC방'],
      };

      const tokens: Token = await AuthService.onBoard(onBoardDTO);

      mockedImagesRepository.create.mockResolvedValue({
        keys: [],
        urls: [],
        userId: 'test',
      });

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should throw BadRequest Exceptions when invalid onboard data is provided', async () => {
      const onBoardDTO: OnBoardDTO = {
        gender: 'MALE',
        nickname: 'invalidNickName',
        location: ['경기'],
        birth: '200011-01-01',
        purpose: '진지한연애',
        interests: ['PC방'],
      };

      try {
        await AuthService.onBoard(onBoardDTO);
      } catch (error) {
        expect(error instanceof Error);
      }
    });
  });

  // describe('signIn()', () => {
  //   it('should return tokens when valid userId is provided', async () => {
  //     const signInDTO = {
  //       userId: USER_ID,
  //     };

  //     const tokens: Token = await AuthService.signIn(signInDTO);

  //     expect(tokens).toHaveProperty('accessToken');
  //     expect(tokens).toHaveProperty('refreshToken');
  //   });

  //   it('should throw Error when invalid userId is provided', async () => {
  //     const signInDTO = {
  //       userId: '',
  //     };

  //     try {
  //       await AuthService.signIn(signInDTO);
  //     } catch (error) {
  //       expect(error instanceof Error);
  //     }
  //   });
  // });

  describe('renew()', () => {
    it('should return tokens when valid refreshToken and userId is provided', async () => {
      const refreshToken = 'refreshToken';

      const renewTokenDTO: RenewTokenDTO = {
        userId: USER_ID,
        refreshToken,
      };

      AuthService.renewToken = jest.fn().mockReturnValue({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });

      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);

      const tokens: Token = await AuthService.renew(renewTokenDTO);

      expect(tokens).toHaveProperty('accessToken');
    });

    it('should throw InvalidTokenException refreshToken does not match', async () => {
      const refreshToken = 'thisisnotmine';

      const renewTokenDTO: RenewTokenDTO = {
        userId: USER_ID,
        refreshToken,
      };

      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);

      try {
        await AuthService.renew(renewTokenDTO);
      } catch (error) {
        expect(error instanceof InvalidTokenException);
      }
    });

    it('should throw Error when invalid refreshToken and userId is provided', async () => {
      const { refreshToken } = AuthService.generateTokens(USER_ID);

      const renewTokenDTOs: RenewTokenDTO[] = [
        {
          userId: '',
          refreshToken,
        },
        {
          userId: USER_ID,
          refreshToken: 'refreshToken',
        },
      ];

      renewTokenDTOs.forEach(async (dto) => {
        try {
          await AuthService.renew(dto);
        } catch (error) {
          expect(error instanceof Error);
        }
      });
    });
  });
});
