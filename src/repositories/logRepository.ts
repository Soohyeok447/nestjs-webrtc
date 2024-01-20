import { Log, LogModel } from '../models/logModel';

class LogRepository {
  public async create(content: string): Promise<Log> {
    const log = new LogModel({ content });

    try {
      return await log.save();
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<Log[] | []> {
    try {
      const logs = await LogModel.find().exec();

      return logs;
    } catch (error) {
      throw error;
    }
  }
}

export default new LogRepository();
