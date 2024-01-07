import { MatchLog, MatchLogModel } from '../models/matchLogModel';

class MatchLogRepository {
  public async create({ id, userIds, status }): Promise<MatchLog> {
    try {
      const matchLog = new MatchLogModel({
        id,
        userIds,
        status,
      });

      return await matchLog.save();
    } catch (error) {
      throw error;
    }
  }
}

export default new MatchLogRepository();
