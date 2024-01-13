import { NotFoundUserException } from '../exceptions/users';
import UserRepository from '../repositories/userRepository';
import BlockRepository from '../repositories/blockRepository';
import { BlockLog } from '../models/blockModel';
import { NotFoundBlockLogException } from '../exceptions/blockLog/NotFoundBlockLogException';

class BlockService {
  /**
   * 유저 차단
   */
  public async blockUser({
    userId,
    targetId,
  }: {
    userId: string;
    targetId: string;
  }): Promise<void> {
    try {
      const user = await UserRepository.findById(userId);
      const target = await UserRepository.findById(targetId);

      if (!user || !target) throw new NotFoundUserException();

      const userBlockLog = await BlockRepository.findByUserId(userId);

      if (!userBlockLog) {
        // 유저 차단 로그가 생성돼있지 않다면 새로 생성
        await BlockRepository.create({ userId, blockUserId: targetId });
      } else {
        // 유저 차단 로그가 생성돼있다면 수정
        await BlockRepository.update({ userId, blockUserId: targetId });
      }
    } catch (err) {
      console.log(err);

      return;
    }
  }

  /**
   * 유저 차단해제
   */
  public async unBlockUser({
    userId,
    targetId,
  }: {
    userId: string;
    targetId: string;
  }): Promise<void> {
    try {
      const user = await UserRepository.findById(userId);
      const target = await UserRepository.findById(targetId);

      if (!user || !target) throw new NotFoundUserException();

      const userBlockLog = await BlockRepository.findByUserId(userId);

      if (!userBlockLog) {
        // 유저 차단 로그가 생성돼있지 않다면 새로 생성
        await BlockRepository.create({ userId, blockUserId: targetId });
      } else {
        // 유저 차단 로그가 생성돼있다면 수정
        await BlockRepository.update({ userId, blockUserId: targetId });
      }
    } catch (err) {
      console.log(err);

      return;
    }
  }

  /**
   * 유저 차단정보 찾기
   */
  public async findBlockLog({ userId }: { userId: string }): Promise<BlockLog> {
    try {
      const userBlockLog = await BlockRepository.findByUserId(userId);

      if (!userBlockLog) throw new NotFoundBlockLogException();

      return userBlockLog;
    } catch (err) {
      console.log(err);

      return;
    }
  }
}

export default new BlockService();
