import UserService from '../../src/services/userService';
import UserRepository from '../../src/repositories/userRepository';
import {
  InvalidNicknameException,
  InvalidBirthFormatException,
  InvalidLocationException,
  InvalidInterestsException,
  InvalidPurposeException,
  NotFoundUserException,
} from '../../src/exceptions/users';
import { UpdateUserDTO } from '../../src/controllers/dtos/userDTOs/updateUserDTO';
import { Gender } from '../../src/constants';
import { MOCK_USER, MOCK_RESPONSE_USER } from './constants';

jest.mock('../../src/repositories/userRepository');
const mockedUserRepository = UserRepository as jest.Mocked<
  typeof UserRepository
>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isValidNickname()', () => {
    it('should return true for valid nickname', () => {
      expect(UserService.isValidNickname('파란하늘은여덟')).toBe(true);
      expect(UserService.isValidNickname('12345678')).toBe(true);
      expect(UserService.isValidNickname('테스트테스트12')).toBe(true);
      expect(UserService.isValidNickname('abcdefgh')).toBe(true);
    });

    it('should return false for valid nickname', () => {
      expect(UserService.isValidNickname('')).toBe(false);
      expect(UserService.isValidNickname('123456789')).toBe(false);
      expect(UserService.isValidNickname('테스트테스트123')).toBe(false);
      expect(UserService.isValidNickname('abcdefghi')).toBe(false);
      expect(UserService.isValidNickname('공    백')).toBe(false);
      expect(UserService.isValidNickname('!@#!@')).toBe(false);
      expect(UserService.isValidNickname('하트❤️')).toBe(false);
      expect(UserService.isValidNickname('日本語')).toBe(false);
    });
  });

  describe('isValidBirth()', () => {
    it('should return true for valid birth', () => {
      expect(UserService.isValidBirth('1991-12-25')).toBe(true);
      expect(UserService.isValidBirth('1992-04-30')).toBe(true);
      expect(UserService.isValidBirth('1990-05-12')).toBe(true);
    });

    it('should return false for valid birth', () => {
      expect(UserService.isValidBirth('')).toBe(false);
      expect(UserService.isValidBirth('77-11-30')).toBe(false);
      expect(UserService.isValidBirth('1-1-1')).toBe(false);
      expect(UserService.isValidBirth('94/08/23')).toBe(false);
      expect(UserService.isValidBirth('알아서뭐하게')).toBe(false);
      expect(UserService.isValidBirth('1994/11/5')).toBe(false);
      expect(UserService.isValidBirth('1992/30/5151')).toBe(false);
      expect(UserService.isValidBirth('1995-15-55')).toBe(false);
      expect(UserService.isValidBirth('1995-02-31')).toBe(false);
    });
  });

  describe('isValidLocation()', () => {
    it('should return true for valid location', () => {
      const validLocation = ['경기', '서울'];
      const duplicatedValidLocation = [
        '경기',
        '경기',
        '서울',
        '서울',
        '서울',
        '서울',
      ];

      expect(UserService.isValidLocation(validLocation)).toBe(true);
      expect(UserService.isValidLocation(duplicatedValidLocation)).toBe(true);
    });

    it('should return false for invalid location', () => {
      const invalidLocation = ['InvalidLocation'];
      const emptyLocation = [];

      expect(UserService.isValidLocation(invalidLocation)).toBe(false);
      expect(UserService.isValidLocation(emptyLocation)).toBe(false);
    });
  });

  describe('isValidInterests()', () => {
    it('should return true for valid interests', () => {
      const validInterests = ['게임', '여행', '독서'];
      expect(UserService.isValidInterests(validInterests)).toBe(true);
    });

    it('should return false for more than 3 interests', () => {
      const tooManyInterests = ['게임', '여행', '독서', '영화'];
      expect(UserService.isValidInterests(tooManyInterests)).toBe(false);
    });

    it('should return false for invalid interests', () => {
      const invalidInterests = ['못된관심사', '잘못된관심사'];
      expect(UserService.isValidInterests(invalidInterests)).toBe(false);
    });

    it('should return false for empty interests', () => {
      const emptyInterests: string[] = [];
      expect(UserService.isValidInterests(emptyInterests)).toBe(false);
    });
  });

  describe('isValidPurpose()', () => {
    it('should return true for valid purpose', () => {
      const validPurpose = '진지한연애';
      expect(UserService.isValidPurpose(validPurpose)).toBe(true);
    });

    it('should return false for invalid purpose', () => {
      const invalidPurpose = '못된목적';
      expect(UserService.isValidPurpose(invalidPurpose)).toBe(false);
    });

    it('should return false for empty purpose', () => {
      const emptyPurpose = '';
      expect(UserService.isValidPurpose(emptyPurpose)).toBe(false);
    });
  });

  describe('isValidGender()', () => {
    it('should return true for valid gender', () => {
      const validGenders: Gender[] = ['FEMALE', 'MALE'];

      validGenders.forEach((gender) => {
        expect(UserService.isValidGender(gender)).toBe(true);
      });
    });

    it('should return false for invalid gender', () => {
      const invalidGenders = [undefined, '', 'male', 'female', 'OTHER'];
      invalidGenders.forEach((gender) => {
        expect(UserService.isValidGender(gender)).toBe(false);
      });
    });
  });

  describe('update()', () => {
    it('should update a user when valid data is provided and exists user', async () => {
      const validUserData: UpdateUserDTO = {
        id: 'userId',
        nickname: '테스트유저',
        birth: '2000-01-01',
        location: ['서울', '경기'],
        interests: ['캠핑', '여행'],
        purpose: '커피한잔',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedUserRepository.update.mockResolvedValue(MOCK_USER);

      // Act
      const updatedUserResponse = await UserService.update(validUserData);

      // Assert
      expect(updatedUserResponse).toEqual(MOCK_RESPONSE_USER);
    });

    it('should throw an InvalidNicknameException when invalid nickname is provided', async () => {
      const invalidUserData: UpdateUserDTO = {
        id: 'userId',
        nickname: 'ThisNicknameIsTooLong',
        birth: '2000-01-01',
        location: ['서울', '경기'],
        interests: ['캠핑', '여행'],
        purpose: '커피한잔',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedUserRepository.update.mockResolvedValue(MOCK_USER);

      // Assert
      try {
        await UserService.update(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidNicknameException);
      }
    });

    it('should throw an InvalidBirthFormatException when invalid birth is provided', async () => {
      const invalidUserData: UpdateUserDTO = {
        id: 'userId',
        nickname: '테스트유저',
        birth: '3000-01-32',
        location: ['서울', '경기'],
        interests: ['캠핑', '여행'],
        purpose: '커피한잔',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedUserRepository.update.mockResolvedValue(MOCK_USER);

      // Assert
      try {
        await UserService.update(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidBirthFormatException);
      }
    });

    it('should throw an InvalidLocationException when invalid location is provided', async () => {
      const invalidUserData = {
        id: 'userId',
        nickname: '테스트유저',
        birth: '2000-01-01',
        location: ['샌프란시스코', '제부도'],
        interests: ['캠핑', '여행'],
        purpose: '커피한잔',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedUserRepository.update.mockResolvedValue(MOCK_USER);

      // Assert
      try {
        await UserService.update(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidLocationException);
      }
    });

    it('should throw an InvalidInterestsException when invalid interests is provided', async () => {
      const invalidUserData = {
        id: 'userId',
        nickname: '테스트유저',
        birth: '2000-01-01',
        location: ['서울', '경기'],
        interests: ['잘못된취미', '이상한취미'],
        purpose: '커피한잔',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedUserRepository.update.mockResolvedValue(MOCK_USER);

      // Assert
      try {
        await UserService.update(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidInterestsException);
      }
    });

    it('should throw an InvalidPurposeExceptionwhen invalid purpose is provided ', async () => {
      const invalidUserData = {
        id: 'userId',
        nickname: '테스트유저',
        birth: '2000-01-01',
        location: ['서울', '경기'],
        interests: ['캠핑', '여행'],
        purpose: '잘못된목적',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedUserRepository.update.mockResolvedValue(MOCK_USER);

      // Assert
      try {
        await UserService.update(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPurposeException);
      }
    });

    it('should throw an NotFoundUserException when user does not exist', async () => {
      const validUserData = {
        id: 'userId',
        nickname: '테스트유저',
        birth: '2000-01-01',
        location: ['서울', '경기'],
        interests: ['캠핑', '여행'],
        purpose: '커피한잔',
      };

      // Mock
      mockedUserRepository.findById.mockResolvedValue(null);

      // Assert
      try {
        await UserService.update(validUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundUserException);
      }
    });
  });

  describe('findById()', () => {
    it('should return user when user exists', async () => {
      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);

      // Act
      const updatedUserResponse = await UserService.findById('userId');

      // Assert
      expect(updatedUserResponse).toEqual(MOCK_RESPONSE_USER);
    });

    it('should throw NotFoundUserException when user does not exist', async () => {
      // Mock
      mockedUserRepository.findById.mockResolvedValue(null);

      // Assert
      try {
        await UserService.findById('userId');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundUserException);
      }
    });
  });
});
