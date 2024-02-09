import {
  LOCATION_LIST,
  INTEREST_LIST,
  PURPOSE_LIST,
  Location,
  Interest,
  Purpose,
} from '../constants';
import {
  InvalidNicknameException,
  InvalidBirthFormatException,
  InvalidLocationException,
  InvalidInterestsException,
  InvalidPurposeException,
  NotFoundUserException,
} from '../exceptions/users';
import { User } from '../models/userModel';
import { UserResponseModel } from '../models/userResponseModel';
import UserRepository from '../repositories/userRepository';
import DateService from './dateService';

class UserService {
  public async update({
    id,
    nickname,
    birth,
    location,
    interests,
    purpose,
  }): Promise<UserResponseModel | null> {
    try {
      //validate nickname
      if (!this.isValidNickname(nickname)) {
        throw new InvalidNicknameException();
      }

      //validate birth
      if (!this.isValidBirth(birth)) {
        throw new InvalidBirthFormatException();
      }

      //validate location
      if (!this.isValidLocation(location)) {
        throw new InvalidLocationException();
      }

      //validate interests
      if (!this.isValidInterests(interests)) {
        throw new InvalidInterestsException();
      }

      //validate purpose
      if (!this.isValidPurpose(purpose)) {
        throw new InvalidPurposeException();
      }

      const user: User = await UserRepository.findById(id);

      if (!user) throw new NotFoundUserException();

      const updatedUser: User = await UserRepository.update({
        id,
        nickname,
        birth,
        location: Array.from(new Set(location)),
        interests: Array.from(new Set(interests)),
        purpose,
      });

      const userResponse: UserResponseModel =
        this.mapUserToUserResponseModel(updatedUser);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  //socketId가 유효한지
  public isValidSocketId(socketId?: string): boolean {
    return !!socketId;
  }

  //8자 이하 영어,숫자,한글만 허용
  public isValidNickname(nickname?: string): boolean {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{1,8}$/;

    return !!nickname && nicknameRegex.test(nickname);
  }

  //정해진 purpose 리스트만 허용
  public isValidPurpose(purpose?: string): boolean {
    const isValid = !!purpose && PURPOSE_LIST.includes(purpose as Purpose);

    return isValid;
  }

  //정해진 interests 목록만 3개 이하 허용
  public isValidInterests(interests?: string[]): boolean {
    const isValid =
      !!interests &&
      interests.length > 0 &&
      interests.every((interest) =>
        INTEREST_LIST.includes(interest as Interest),
      );

    const isNotMoreThanThree = new Set(interests).size <= 3;

    return isValid && isNotMoreThanThree;
  }

  //정해진 location 목록만 3개 이하 허용
  public isValidLocation(location?: string[]): boolean {
    const isValid =
      !!location &&
      location.length > 0 &&
      location.every((loc) => LOCATION_LIST.includes(loc as Location));

    const isNotMoreThanThree = new Set(location).size <= 3;

    return isValid && isNotMoreThanThree;
  }

  // YYYY-MM-DD 형식이어야 함
  public isValidBirth(birth?: string): boolean {
    return DateService.isValidDate(birth);
  }

  // MALE, FEMALE, ALL 둘 중 하나여야 함
  public isValidGender(gender?: string): boolean {
    const isValid =
      !!gender &&
      (gender === 'MALE' || gender === 'FEMALE' || gender === 'ALL');

    return isValid;
  }

  public async findById(id: string): Promise<UserResponseModel | null> {
    try {
      const user: User = await UserRepository.findById(id);

      if (!user) throw new NotFoundUserException();

      const userResponse: UserResponseModel =
        this.mapUserToUserResponseModel(user);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  // User Model을 UserResponseModel로 변환
  private mapUserToUserResponseModel(user: User): UserResponseModel {
    return {
      id: user.id,
      gender: user.gender,
      nickname: user.nickname,
      birth: user.birth,
      age: this.calculateAge(user.birth),
      location: user.location,
      purpose: user.purpose,
      interests: user.interests,
      bans: user.bans,
      reported: user.reported,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // 나이 계산
  public calculateAge(birth: string): number {
    // 현재 날짜
    const currentDate = new Date();

    // 생년월일을 Date 객체로 변환
    const birthDate = new Date(birth);

    // 현재 나이 계산
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // 아직 생일 안지났으면 한 살 빼주기
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

export default new UserService();
