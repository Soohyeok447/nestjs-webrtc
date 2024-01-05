import { MatchStatus } from '../constants';
import MatchLogRepository from '../repositories/matchLogRepository';
import UserRepository from '../repositories/userRepository';
import UUIDService from './uuidService';

class MatchLogService {
  /**
   * 매치로그 생성
   */
  private async createLog({
    userIds,
    status,
  }: {
    userIds: string[];
    status: MatchStatus;
  }): Promise<void> {
    try {
      //id가 User DB에 있는지 확인 1명이라도 없으면 catch됨
      await this._validateUserIds(userIds);

      const id = UUIDService.generateUUID();

      //전부 db에 존재하는 유저면 로그 생성
      await MatchLogRepository.create({ id, userIds, status });
    } catch (err) {
      console.log(err);

      return;
    }
  }

  public async createPendingMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'pending' });
  }

  public async createExpiredMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'expired' });
  }

  public async createDeclinedMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'declined' });
  }

  public async createCanceledMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'canceled' });
  }

  public async createMatchedMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'matched' });
  }

  public async createCompletedMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'completed' });
  }

  public async createReportedMatchLog({ userIds }): Promise<void> {
    await this.createLog({ userIds, status: 'reported' });
  }

  private async _validateUserIds(userIds: string[]) {
    return await Promise.all(
      userIds.map(async (e) => {
        return await UserRepository.findById(e);
      }),
    );
  }
}

export default new MatchLogService();
