import { NotFoundUserException } from '../exceptions/users';
import UserRepository from '../repositories/userRepository';
import BlockLogRepository from '../repositories/blockLogRepository';
import { BlockLog } from '../models/blockLogModel';
import { BlockUserDTO } from '../controllers/dtos/blockLogDTOs/blockUserDTO';
import { UnblockUserDTO } from '../controllers/dtos/blockLogDTOs/unblockUserDTO';
import { NotFoundBlockLogException } from '../exceptions/blockLog/NotFoundBlockLogException';

class BlockLogService {
  /**
   * 유저 차단
   */
  public async blockUser({
    userId,
    targetId,
  }: BlockUserDTO): Promise<BlockLog> {
    try {
      const user = await UserRepository.findById(userId);
      const target = await UserRepository.findById(targetId);

      if (!user || !target) throw new NotFoundUserException();

      const userBlockLog = await BlockLogRepository.findByUserId(userId);

      if (!userBlockLog) {
        // 유저 차단 로그가 생성돼있지 않다면 새로 생성
        const blockLog = await BlockLogRepository.create({
          userId,
          blockUserId: targetId,
        });

        return this.mapBlockLog(blockLog);
      } else {
        // 유저 차단 로그가 생성돼있다면 수정
        const blockLog = await BlockLogRepository.update({
          userId,
          blockUserId: targetId,
        });

        return this.mapBlockLog(blockLog);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 차단 해제
   */
  public async unblockUser({
    userId,
    targetId,
  }: UnblockUserDTO): Promise<BlockLog> {
    try {
      const user = await UserRepository.findById(userId);
      const target = await UserRepository.findById(targetId);

      if (!user || !target) throw new NotFoundUserException();

      const userBlockLog = await BlockLogRepository.findByUserId(userId);

      if (!userBlockLog) throw new NotFoundBlockLogException();

      // 유저 차단 로그가 존재하면 차단 해제
      const blockLog = await BlockLogRepository.remove({
        userId,
        blockUserId: targetId,
      });

      return this.mapBlockLog(blockLog);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 차단정보 찾기
   */
  public async findBlockLog({ userId }): Promise<BlockLog> {
    try {
      const blockLog = await BlockLogRepository.findByUserId(userId);

      if (!blockLog) {
        // 유저 차단 로그가 생성돼있지 않다면 새로 생성
        const blockLog = await BlockLogRepository.create({
          userId,
          blockUserId: null,
        });

        return this.mapBlockLog(blockLog);
      }

      return this.mapBlockLog(blockLog);
    } catch (error) {
      throw error;
    }
  }

  private mapBlockLog(blockLog: BlockLog): BlockLog | PromiseLike<BlockLog> {
    return {
      userId: blockLog.userId,
      blockUserIds: blockLog.blockUserIds,
      createdAt: blockLog.createdAt,
      updatedAt: blockLog.updatedAt,
    };
  }
}

export default new BlockLogService();
