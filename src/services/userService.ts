import { LOCATION_LIST, INTERESTS_LIST, PURPOSE_LIST, Location, Interests, Purpose, Gender } from "../constants";
import { UpdateUserDTO } from "../controllers/dtos/userDTOs/updateUserDTO";
import { InvalidNicknameException, InvalidGenderException, InvalidBirthFormatException, InvalidLocationException, InvalidInterestsException, InvalidPurposeException } from "../exceptions/users";
import { NotFoundUserException } from "../exceptions/users/NotFoundUserException";
import { User } from "../models/userModel";
import { UserResponseModel } from "../models/userResponseModel";
import UserRepository from "../repositories/userRepository";

class UserService {
  public async update({ id, nickname, birth, location, interests, purpose }: UpdateUserDTO): Promise<UserResponseModel | null> {
    try {
      //validate nickname
      this.validateNickname(nickname);

      //validate birth
      this.validateBirth(birth);

      //validate location
      this.validateLocation(location);

      //validate interests
      this.validateInterests(interests);

      //validate purpose
      this.validatePurpose(purpose);

      const user: User = await UserRepository.findById(id);

      if (!user) throw new NotFoundUserException();

      const updatedUser: User = await UserRepository.update({
        id,
        nickname,
        birth,
        location: Array.from(new Set(location)),
        interests: Array.from(new Set(interests)),
        purpose
      })

      const userResponse: UserResponseModel = this.mapUserToUserResponseModel(updatedUser);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  //8자 이하 영어,숫자,한글만 허용
  public validateNickname(nickname: string) {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{1,8}$/;

    if (!nickname || !nicknameRegex.test(nickname)) {
      throw new InvalidNicknameException();
    }
  }

  //정해진 purpose 리스트만 허용
  public validatePurpose(purpose: Purpose) {
    if (!purpose || !PURPOSE_LIST.includes(purpose)) {
      throw new InvalidPurposeException();
    }
  }

  //정해진 interests 목록만 3개 이하 허용
  public validateInterests(interests: Interests) {
    if (!interests ||
      interests.length === 0 ||
      interests.some(interest => !INTERESTS_LIST.includes(interest)) ||
      new Set(interests).size > 3) {
      throw new InvalidInterestsException();
    }
  }

  //정해진 location 목록만 3개 이하 허용
  public validateLocation(location: Location) {
    if (!location ||
      !location.length ||
      location.some(loc => !LOCATION_LIST.includes(loc)) ||
      new Set(location).size > 3) {
      throw new InvalidLocationException();
    }
  }

  // YYYY-MM-DD 형식이어야 함
  public validateBirth(birth: string) {
    const birthRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!birth || !birthRegex.test(birth)) {
      throw new InvalidBirthFormatException();
    }
  }

  // MALE, FEMALE 둘 중 하나여야 함
  public validateGender(gender: Gender) {
    if (!gender ||
      gender !== "MALE" && gender !== "FEMALE") throw new InvalidGenderException();
  }

  public async findById(id: string): Promise<UserResponseModel | null> {
    try {
      const user: User = await UserRepository.findById(id);

      if (!user) throw new NotFoundUserException();

      const userResponse: UserResponseModel = this.mapUserToUserResponseModel(user);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }


  // User Model을 UserResponseModel로 변환
  private mapUserToUserResponseModel(user: User): UserResponseModel {
    return {
      id: user.id,
      socketId: user.socketId,
      gender: user.gender,
      nickname: user.nickname,
      birth: user.birth,
      location: user.location,
      purpose: user.purpose,
      interests: user.interests,
      bans: user.bans,
      reported: user.reported,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default new UserService();

