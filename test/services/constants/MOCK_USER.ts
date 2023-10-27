import { User } from '../../../src/models/userModel';

export const MOCK_USER: User = {
  id: 'userId',
  socketId: 'socketId',
  refreshToken: 'refreshToken',
  gender: 'MALE',
  nickname: '테스트유저',
  birth: '2000-01-01',
  location: ['서울', '경기'],
  interests: ['캠핑', '여행'],
  purpose: '커피한잔',
  bans: [],
  reported: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
