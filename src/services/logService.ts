import { Log } from '../models/logModel';
import LogRepository from '../repositories/logRepository';

class LogService {
  /**
   * 로그 생성
   */
  public async createLog(content: string): Promise<void> {
    try {
      await LogRepository.create(content);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 로그들 불러오기
   */
  public async findAllLogs(): Promise<Log[] | []> {
    try {
      const logs = await LogRepository.findAll();

      return logs;
    } catch (error) {
      throw error;
    }
  }
}

export default new LogService();
