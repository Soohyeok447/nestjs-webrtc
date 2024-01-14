import { BlockLog, BlockLogModel } from '../models/blockLogModel';

class BlockLogRepository {
  public async create({ userId, blockUserId }): Promise<BlockLog> {
    const blockLog = blockUserId
      ? new BlockLogModel({ userId, blockUserIds: [blockUserId] })
      : new BlockLogModel({ userId, blockUserIds: [] });

    try {
      return await blockLog.save();
    } catch (error) {
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<BlockLog | void> {
    try {
      const blockLog = await BlockLogModel.findOne({ userId }).exec();

      return blockLog;
    } catch (error) {
      throw error;
    }
  }

  public async update({ userId, blockUserId }): Promise<BlockLog> {
    try {
      const block = await BlockLogModel.findOne({ userId }).exec();

      // blockUserIds 배열에서 blockUserId를 찾고
      const index = block.blockUserIds.indexOf(blockUserId);

      if (index === -1) {
        block.blockUserIds.push(blockUserId); // 차단할 유저가 없으면 추가
      } else {
        return block; // 차단할 유저가 이미 있으면 변경 없이 종료
      }

      return await block.save();
    } catch (error) {
      throw error;
    }
  }

  public async remove({ userId, blockUserId }): Promise<BlockLog> {
    try {
      const block = await BlockLogModel.findOne({ userId }).exec();

      if (block) {
        // blockUserIds 배열에서 blockUserId를 찾고
        const index = block.blockUserIds.indexOf(blockUserId);

        if (index !== -1) {
          // 차단된 유저가 존재하면 삭제
          block.blockUserIds.splice(index, 1);
        } else {
          return block;
        }

        return await block.save();
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new BlockLogRepository();
