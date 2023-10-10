import AuthService from '../../src/services/authService'; // AuthService의 실제 경로로 수정해야 합니다.
import { Token } from '../../src/types/token';
import { InvalidTokenException } from '../../src/exceptions/auth/InvalidToken';
import { NotFoundTokenException } from '../../src/exceptions/auth/NotFoundToken';
import { FetchOrGenerateTokenDTO } from '../../src/controllers/dtos/authDTOs/fetchOrGenerateTokenDTO';
import { RenewTokenDTO } from '../../src/controllers/dtos/authDTOs/renewTokenDTO';

describe('AuthService', () => {
  describe('Test generateTokens()', () => {
    it('should generate tokens', () => {
      const tokens: Token = AuthService.generateTokens();

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });
  })


  it('should verify valid token', () => {
    const tokens: Token = AuthService.generateTokens();
    const validToken = tokens.accessToken;
    expect(AuthService.verifyToken(validToken)).toBe(true);
  });

  it('should throw InvalidTokenException for invalid token', () => {
    const invalidToken = 'invalid-token';
    expect(() => AuthService.verifyToken(invalidToken)).toThrow(InvalidTokenException);
  });

  it('should fetch or generate token with valid accessToken', () => {
    const tokens: Token = AuthService.signIn({ accessToken: 'valid-token' });
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens.refreshToken).toBeUndefined();
  });

  it('should throw InvalidTokenException when accessToken is expired', () => {
    const expiredToken = 'expired-token';
    expect(() => AuthService.signIn({ accessToken: expiredToken })).toThrow(InvalidTokenException);
  });

  // Add more test cases for other AuthService methods...
});