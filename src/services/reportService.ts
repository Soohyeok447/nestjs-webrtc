import { NotFoundUserException } from '../exceptions/users';
import UserRepository from '../repositories/userRepository';

class ReportService {
  /**
   * 화상채팅 도중 상대유저를 신고함
   */
  public async reportUser({
    userId,
    targetId,
  }: {
    userId: string;
    targetId: string;
  }): Promise<void> {
    try {
      // 유저 유효성 검사
      const user = await UserRepository.findById(userId);
      const target = await UserRepository.findById(targetId);

      if (!user || !target) throw new NotFoundUserException();

      // reported 속성을 +1함
      await UserRepository.update({
        id: targetId,
        reported: target.reported + 1,
      });
    } catch (error) {
      console.log(error);

      return;
    }
  }
}

export default new ReportService();
