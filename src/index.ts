import express from 'express';
import { setMongoose } from './config/db';
import apiRouter from './routes/apiRoute';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { serve, setup, swaggerSpec } from './config/swagger';
import { throttle } from './config/throttle';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import {
  configureS3,
  printS3BucketList,
  // printStorageInfo,
} from './config/storage';
import UserRepository from './repositories/userRepository';
import ImagesRepository from './repositories/imageRepository';
import { NotFoundUserException } from './exceptions/users';
import { User } from './models/userModel';
import { NotFoundImagesException } from './exceptions/images/NotFoundImagesException';
import { Images } from './models/imagesModel';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const PORT = process.env.PORT;
const PROXY_PORT = (+PORT + 1).toString();
const SERVER_URL = process.env.SERVER_URL;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use('/socket.io', express.static('node_modules/socket.io/client-dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const corsOptions = {
  origin: environment === 'development' ? '*' : `${SERVER_URL}:${PROXY_PORT}`,
};
app.use(cors(corsOptions));

app.disable('x-powered-by');

app.use('/docs', serve, setup(swaggerSpec));

app.use('/api', throttle);
app.use(`/api`, apiRouter);

httpServer.listen(PORT, () => {
  configureS3();
  // printStorageInfo();
  printS3BucketList();
  setMongoose();
});

/**
 * Socket
 */

// 대기 풀 및 매칭대기된 User Set
const waitingUsers = new Map<string, Socket>(); //userId, socket
const pendingUsers = new Map<string, Socket>();

io.on('connection', (socket: Socket) => {
  console.log(io.sockets.adapter.sids);

  socket.on('startMatching', async (userId) => {
    console.log('startMatching 발생. waitingUsers.size', waitingUsers.size);

    try {
      const currentUser: User = await UserRepository.findById(userId);

      if (!currentUser) throw new NotFoundUserException();

      const matchedUser = await findUser(currentUser);

      if (!matchedUser) waitingUsers.set(userId, socket);
      else {
        await introduceEachUsers(
          socket,
          matchedUser.socket,
          currentUser,
          matchedUser.user,
        );
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Accept 또는 Decline 처리
  socket.on(
    'userResponse',
    (userId: string, matchedUserId: string, response: string) => {
      console.log('상대방의 userId', matchedUserId);
      console.log('내 response', response);

      const matchedUserSocket = getUserSocketUsingUserId(matchedUserId);

      if (matchedUserSocket) {
        handleUserResponse(
          socket,
          matchedUserSocket,
          userId,
          matchedUserId,
          response,
        );
      } else {
        console.log('소켓이 없는데요?');
      }
    },
  );

  socket.on('disconnect', () => {
    console.log('연결이 끊어졌습니다.');
    handleDisconnect(socket);
  });
});

// 매칭 조건에 맞는 유저 찾기
async function findUser(currentUser: User) {
  for (const [userId, matchedUserSocket] of waitingUsers) {
    try {
      // 본인은 제외하고 다른 유저들을 find
      if (userId !== currentUser.id) {
        //TODO 실제 매칭 조건 추가 (gender, interests, purpose 등)
        const matchedUser = await UserRepository.findById(userId);

        if (!matchedUser) throw new NotFoundUserException();

        if (userId !== currentUser.id) {
          waitingUsers.delete(userId);

          return { user: matchedUser, socket: matchedUserSocket };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

// 유저들을 서로 소개
async function introduceEachUsers(
  socketA: Socket,
  socketB: Socket,
  userA: User,
  userB: User,
) {
  const userAImages: Images = await ImagesRepository.findByUserId(userA.id);
  const userBImages: Images = await ImagesRepository.findByUserId(userB.id);

  if (!userAImages || !userBImages) throw new NotFoundImagesException();

  //TODO 추후 room정보와 userA, userB의 id 저장 (web RTC 및 logging)
  const roomName = `room-${userA.id}-${userB.id}`;
  socketA.join(roomName);
  socketB.join(roomName);

  pendingUsers.set(userA.id, socketA);
  pendingUsers.set(userB.id, socketB);

  const userAInfo = {
    id: userA.id,
    gender: userA.gender,
    interests: userA.interests,
    purpose: userA.purpose,
    nickname: userA.nickname,
    location: userA.location,
    profileUrl: userAImages.urls[0],
  };

  const userBInfo = {
    id: userB.id,
    gender: userB.gender,
    interests: userB.interests,
    purpose: userB.purpose,
    nickname: userB.nickname,
    location: userB.location,
    profileUrl: userBImages.urls[0],
  };

  console.log('매칭대기 성공했습니다. 서로 소개합니다.');
  console.log('서로 소개 이후 waitingUsers.size', waitingUsers.size);
  console.log('서로 소개 이후 pendingUsers.size', pendingUsers.size);

  // 클라이언트에게 상대방 정보를 전달
  socketA.emit('introduceEachUsers', userBInfo);
  socketB.emit('introduceEachUsers', userAInfo);

  // timeOut
  setTimeout(() => {
    if (
      socketA.connected &&
      socketB.connected &&
      !socketA['matched'] &&
      !socketB['matched']
    ) {
      // response property 초기화
      socketA['response'] = null;
      socketB['response'] = null;

      //매칭이 안되었으므로 waiting Set에 유저 2명 추가
      waitingUsers.set(userA.id, socketA);
      waitingUsers.set(userB.id, socketB);

      //매칭이 안되었으므로 pending Set에 유저 2명 삭제
      pendingUsers.delete(userA.id);
      pendingUsers.delete(userB.id);

      socketA.leave(roomName);
      socketB.leave(roomName);

      //매칭 실패 result 클라이언트로 emit
      socketA.emit('matchResult', false);
      socketB.emit('matchResult', false);

      console.log('timeOut으로 매칭 실패했습니다.');
      console.log('timeOut 이후 waitingUsers.size', waitingUsers.size);
      console.log('timeOut 이후 pendingUsers.size', pendingUsers.size);

      //re matching
      socketA.emit('reMatch');
      socketB.emit('reMatch');
    }
  }, 10000);
}

// Accept 또는 Decline 처리
function handleUserResponse(
  socket: Socket,
  matchedUserSocket: Socket,
  userId: string,
  matchedUserId: string,
  response: string,
) {
  // socket property에 response 정보 저장
  if (response === 'accept') {
    socket['response'] = 'accept';
  } else {
    socket['response'] = 'decline';
  }

  // socket response 정보가 상호 accept일 때
  if (
    socket['response'] === 'accept' &&
    matchedUserSocket['response'] === 'accept'
  ) {
    // response property 초기화
    socket['response'] = null;
    matchedUserSocket['response'] = null;

    // 클라이언트에게 matchResult true로 emit
    socket.emit('matchResult', true);
    matchedUserSocket.emit('matchResult', true);

    // matched 상태 true로 저장
    socket['matched'] = true;
    matchedUserSocket['matched'] = true;

    //서로 상대 socket id 저장
    socket['matchedUserSocketId'] = matchedUserSocket.id;
    matchedUserSocket['matchedUserSocketId'] = socket.id;

    // 매칭이 되었으니 pendingUsers Set에서 매칭된 유저 2명 제거
    pendingUsers.delete(userId);
    pendingUsers.delete(matchedUserId);

    console.log('상호 accept로 인해 매칭 성공했습니다.');
    console.log('매칭 accepted 이후 waitingUsers.size', waitingUsers.size);
    console.log('매칭 accepted 이후 pendingUsers.size', pendingUsers.size);
  }

  // 둘 중 한명이라도 decline을 선택했을 때
  if (
    socket['response'] === 'decline' ||
    matchedUserSocket['response'] === 'decline'
  ) {
    // response property 초기화
    socket['response'] = null;
    matchedUserSocket['response'] = null;

    // 클라이언트에게 matchResult false로 emit
    socket.emit('matchResult', false);
    matchedUserSocket.emit('matchResult', false);

    // 매칭이 안되었으니 pendingUsers Set에서 매칭된 유저 2명 제거
    pendingUsers.delete(userId);
    pendingUsers.delete(matchedUserId);

    // 매칭이 안되었으니 waitingUsers Set에 매칭 안된 유저 2명 추가
    waitingUsers.set(userId, socket);
    waitingUsers.set(matchedUserId, matchedUserSocket);

    console.log('decline되어서 매칭 실패했습니다.');
    console.log('매칭 declined 이후 waitingUsers.size', waitingUsers.size);
    console.log('매칭 declined 이후 pendingUsers.size', pendingUsers.size);

    //re matching
    socket.emit('reMatch');
    matchedUserSocket.emit('reMatch');
  }
}

// Disconnect 처리
function handleDisconnect(socket: Socket) {
  // waitingUsers Set에서 삭제
  waitingUsers.forEach((userSocket, userId) => {
    if (userSocket === socket) {
      waitingUsers.delete(userId);
    }
  });

  // pendingUsers Set에서 삭제
  pendingUsers.forEach((userSocket, userId) => {
    if (userSocket === socket) {
      pendingUsers.delete(userId);
    }
  });
}

function getUserSocketUsingUserId(id: string): Socket | null {
  // userId를 이용하여 pendingUsers Set 에서 해당 유저Socket을 찾음
  for (const [userId, socket] of pendingUsers) {
    if (userId === id) {
      return socket;
    }
  }
  return null;
}
