import { Images } from '../../../src/models/imagesModel';
import { createdAt } from './MOCK_CREATEDAT';
import { updatedAt } from './MOCK_UPDATEDAT';

export const MOCK_IMAGES: Images = {
  userId: 'userId',
  keys: ['testfile', 'testfile'],
  urls: ['url1', 'url2'],
  createdAt,
  updatedAt,
};
