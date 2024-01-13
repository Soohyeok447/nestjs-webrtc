import { BlockLog, BlockLogModel } from '../models/blockModel';

class BlockRepository {
  public async create({ userId, blockUserId }): Promise<BlockLog> {
    const block = new BlockLogModel({ userId, blockUserIds: [blockUserId] });

    try {
      return await block.save();
    } catch (error) {
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<BlockLog | null> {
    try {
      return await BlockLogModel.findOne({ userId }).exec();
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
        // 차단할 유저가 없으면 추가
        block.blockUserIds.push(blockUserId);
      } else {
        // 차단할 유저가 이미 있으면 삭제
        block.blockUserIds.splice(index, 1);
      }

      return await block.save();
    } catch (error) {
      throw error;
    }
  }
}

export default new BlockRepository();
