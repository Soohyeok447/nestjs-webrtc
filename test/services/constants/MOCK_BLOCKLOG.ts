import { BlockLog } from '../../../src/models/blockLogModel';
import { createdAt } from './MOCK_CREATEDAT';
import { updatedAt } from './MOCK_UPDATEDAT';

export const MOCK_BLOCKLOG: BlockLog = {
  userId: 'userId',
  blockUserIds: ['targetId', 'targetId2'],
  createdAt,
  updatedAt,
};
