import BlockLogService from '../../src/services/blockLogService';
import UserRepository from '../../src/repositories/userRepository';
import BlockLogRepository from '../../src/repositories/blockLogRepository';
import { NotFoundUserException } from '../../src/exceptions/users';
import { MOCK_USER } from './constants';
import { MOCK_BLOCKLOG } from './constants/MOCK_BLOCKLOG';
import { createdAt } from './constants/MOCK_CREATEDAT';
import { updatedAt } from './constants/MOCK_UPDATEDAT';
import { NotFoundBlockLogException } from '../../src/exceptions/blockLog/NotFoundBlockLogException';

jest.mock('../../src/repositories/userRepository');
const mockedUserRepository = UserRepository as jest.Mocked<
  typeof UserRepository
>;

jest.mock('../../src/repositories/blockLogRepository');
const mockedBlockLogRepository = BlockLogRepository as jest.Mocked<
  typeof BlockLogRepository
>;

describe('BlockLogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('blockUser()', () => {
    it('should throw a NotFoundUserException when user is not found', async () => {
      const userId = 'userId';
      const targetId = 'targetId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(null);

      // Assert
      try {
        await BlockLogService.blockUser({ userId, targetId });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundUserException);
      }
    });

    it('should return blockLog when the blockLog is not found', async () => {
      const userId = 'userId';
      const targetId = 'targetId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedBlockLogRepository.findByUserId.mockResolvedValue(null);
      mockedBlockLogRepository.create.mockResolvedValue({
        userId: 'userId',
        blockUserIds: ['targetId'],
        createdAt,
        updatedAt,
      });

      // Assert
      const result = await BlockLogService.blockUser({ userId, targetId });

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('blockUserIds');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.blockUserIds).toEqual(['targetId']);
    });

    it('should return blockLog when the blockLog is found', async () => {
      const userId = 'userId';
      const targetId = 'targetId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedBlockLogRepository.findByUserId.mockResolvedValue(MOCK_BLOCKLOG);
      mockedBlockLogRepository.update.mockResolvedValue({
        userId: 'userId',
        blockUserIds: ['targetId', 'targetId2'],
        createdAt,
        updatedAt,
      });

      // Assert
      const result = await BlockLogService.blockUser({ userId, targetId });

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('blockUserIds');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.blockUserIds).toEqual(['targetId', 'targetId2']);
    });
  });

  describe('unblockUser()', () => {
    it('should throw a NotFoundUserException when user is not found', async () => {
      const userId = 'userId';
      const targetId = 'targetId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(null);

      // Assert
      try {
        await BlockLogService.unblockUser({ userId, targetId });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundUserException);
      }
    });

    it('should throw a NotFoundBlockLogException when blockLog is not found', async () => {
      const userId = 'userId';
      const targetId = 'targetId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedBlockLogRepository.findByUserId.mockResolvedValue(null);

      // Assert
      try {
        await BlockLogService.unblockUser({ userId, targetId });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundBlockLogException);
      }
    });

    it('should return blockLog when the blockLog is found', async () => {
      const userId = 'userId';
      const targetId = 'targetId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedBlockLogRepository.findByUserId.mockResolvedValue(MOCK_BLOCKLOG);
      mockedBlockLogRepository.remove.mockResolvedValue({
        userId: 'userId',
        blockUserIds: ['targetId'],
        createdAt,
        updatedAt,
      });

      // Assert
      const result = await BlockLogService.unblockUser({ userId, targetId });

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('blockUserIds');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.blockUserIds).toEqual(['targetId']);
    });
  });

  describe('findBlockLog()', () => {
    it('should return blockLog when the blockLog is not found', async () => {
      const userId = 'userId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedBlockLogRepository.findByUserId.mockResolvedValue(null);
      mockedBlockLogRepository.create.mockResolvedValue({
        userId: 'userId',
        blockUserIds: [],
        createdAt,
        updatedAt,
      });

      // Assert
      const result = await BlockLogService.findBlockLog({ userId });

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('blockUserIds');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.blockUserIds).toEqual([]);
    });

    it('should return blockLog when the blockLog is found', async () => {
      const userId = 'userId';

      // Mock
      mockedUserRepository.findById.mockResolvedValue(MOCK_USER);
      mockedBlockLogRepository.findByUserId.mockResolvedValue(MOCK_BLOCKLOG);

      // Assert
      const result = await BlockLogService.findBlockLog({ userId });

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('blockUserIds');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.blockUserIds).toEqual(['targetId', 'targetId2']);
    });
  });
});
