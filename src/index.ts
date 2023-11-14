import express, { Express } from 'express';
// import { createServer } from "http";
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

import UserRepository from './repositories/userRepository';
import ImageRepository from './repositories/imageRepository';
import { User, UserModel } from './models/userModel';
import { configureAWS, getAwsCredentials } from './config/storage';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});

const app: Express = express();
const PORT = process.env.PORT;
const PROXY_PORT = (+PORT + 1).toString();
const SERVER_URL = process.env.SERVER_URL;

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(
  '/socket.io',
  express.static(__dirname + '/node_modules/socket.io/client-dist'),
);

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

//TODO Refactor this
// 대기 풀 및 매칭된 사용자 저장 배열
let waitingPool = [];
// const matchedUsers = [];

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('hi', (hi) => {
    console.log(hi);
  });

  // Start Matching 버튼 클릭 시 대기 풀에 추가
  socket.on('start_matching', async (userId: string) => {
    const user = new UserModel({ userId, socketId: socket.id });
    await user.save();

    waitingPool.push(user);
    matchUsers();
  });

  // 매칭 로직
  const matchUsers = async () => {
    if (waitingPool.length >= 2) {
      const user1 = waitingPool.shift()!;
      const user2 = waitingPool.shift()!;

      // UserRepository를 통해 사용자 정보 가져오기
      const matchedUser1 = await UserRepository.findById(user1.userId);
      const matchedUser2 = await UserRepository.findById(user2.userId);

      // ImagesRepository를 통해 사용자 이미지 정보 가져오기 (예시로 추가한 부분이며, 실제로 사용하는 이미지 소스에 따라 수정이 필요할 수 있습니다.)
      const image1 = await ImageRepository.findByUserId(user1.userId);
      const image2 = await ImageRepository.findByUserId(user2.userId);

      // TODO 매칭 완료 이벤트 전송 수정해라 이거를
      io.to(user1.socketId).emit('match_request', {
        userId: matchedUser2?.id,
        userName: matchedUser2?.nickname,
        userImage: image2?.urls,
      });
      io.to(user2.socketId).emit('match_request', {
        userId: matchedUser1?.id,
        userName: matchedUser1?.nickname,
        userImage: image1?.urls,
      });
    }
  };

  // 수락 또는 거절 시 처리
  socket.on(
    'respond_to_match',
    async (matchedUserId: string, response: 'accept' | 'decline') => {
      const matchedUser = waitingPool.find(
        (user) => user.userId === matchedUserId,
      );

      if (matchedUser) {
        // 매칭 상대에게 응답 전송
        io.to(matchedUser.socketId).emit('match_response', socket.id, response);

        if (response === 'accept') {
          // 응답이 수락인 경우 WebRTC 시그널링을 시작할 수 있습니다.
          io.to(socket.id).emit('start_webRTC', matchedUserId);
          io.to(matchedUser.socketId).emit('start_webRTC', socket.id);

          // 매칭된 사용자 목록에서 제거
          waitingPool = waitingPool.filter(
            (user) => user.userId !== matchedUserId,
          );
          waitingPool = waitingPool.filter((user) => user.userId !== socket.id);

          // TODO MongoDB에서 사용자 제거 MatchingRepository를 하나 만들고 거기서 remove하자
          // await User.deleteMany({
          //   userId: { $in: [matchedUserId, socket.id] },
          // });

          // 매칭 정보 로깅
          logMatchingInfo(matchedUser);
        } else if (response === 'decline') {
          // 응답이 거절인 경우 다시 대기 풀에 추가
          waitingPool.push(matchedUser);
        }
      }
    },
  );

  // 매칭 대기 취소
  socket.on('cancelMatching', async () => {
    // 대기 풀에서 사용자 제거
    waitingPool = waitingPool.filter((user) => user.socketId !== socket.id);

    // TODO  MongoDB에서 사용자 제거 MatchingRepository를 하나 만들고 거기서 remove하자
    // await UserRepository.({ socketId: socket.id });
  });

  // 연결 해제 시 처리
  socket.on('disconnect', async () => {
    console.log('A user disconnected');

    // 대기 풀 및 매칭된 사용자 목록에서 제거
    waitingPool = waitingPool.filter((user) => user.socketId !== socket.id);

    // TODO  MongoDB에서 사용자 제거 MatchingRepository를 하나 만들고 거기서 remove하자
    // await User.deleteOne({ socketId: socket.id });
  });

  // 매칭 정보 로깅 함수
  const logMatchingInfo = (matchedUser: User) => {
    console.log(`Matching Successful: ${socket.id} and ${matchedUser.id}`);
    // 여기에 매칭 정보를 파일이나 다른 로깅 시스템에 저장하는 코드를 추가할 수 있습니다.
  };
});

app.listen(PORT, () => {
  configureAWS();
  getAwsCredentials();
  setMongoose();
});
