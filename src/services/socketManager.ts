import { Server, Socket } from 'socket.io';
import MatchingService from './matchingService';
import { MatchEvents } from '../constants';
import {
  CancelMatching,
  RespondToIntroduce,
  StartMatching,
} from '../types/eventParameters';

class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public initialize() {
    this.io.on('connection', (socket: Socket) => {
      // console.log(this.io.sockets.adapter.sids);
      console.log(socket.id, '접속');

      this.setupMatchingListener(socket);
      this.setupWebRTCListener(socket);

      socket.on('disconnect', () => {
        console.log(socket.id, '접속 해제');

        MatchingService.handleDisconnect(socket);
      });
    });
  }

  private setupMatchingListener(socket: Socket) {
    // 소켓 status를 idle로 설정
    socket.status = 'idle';

    // 소개매칭 대기 시작
    socket.on(MatchEvents.START_MATCHING, async ({ userId }: StartMatching) => {
      MatchingService.startMatching({ socket, userId });
    });

    // 소개매칭 대기 취소
    socket.on(
      MatchEvents.CANCEL_MATCHING,
      async ({ userId }: CancelMatching) => {
        MatchingService.cancelMatching({ socket, userId });
      },
    );

    // 소개매칭 phase에서 Accept 또는 Decline 처리
    socket.on(
      MatchEvents.RESPOND_TO_INTRODUCE,
      ({ userId: myUserId, response: myResponse }: RespondToIntroduce) => {
        const partnerUserId = socket.partnerUserId;
        const partnerSocket = socket.partnerSocket;

        if (partnerSocket) {
          MatchingService.handleUserResponse({
            mySocket: socket,
            partnerSocket,
            myUserId,
            partnerUserId,
            myResponse,
          });
        } else {
          // 소개매칭 응답을 할 때 상대방 소켓데이터가 없다는 것은
          // 정상적으로 소개 매칭이 이루어지지 않았다는 뜻
          console.log('정상적으로 소개 매칭이 이루어지지 않았습니다.');

          socket.emit(MatchEvents.INVALID_RESPOND_TO_INTRODUCE);
        }
      },
    );
  }

  private setupWebRTCListener(socket: Socket) {
    // 클라이언트가 offer 이벤트를 보낼 때
    socket.on('offer', (data) => {
      const partnerSocket = socket.partnerSocket;

      // partnerSocket에게 offer 이벤트 전송
      partnerSocket.emit('offer', {
        offer: data.offer,
        socketId: socket.id,
      });
    });

    // 클라이언트가 answer 이벤트를 보낼 때
    socket.on('answer', (data) => {
      const partnerSocket = socket.partnerSocket;

      // partnerSocket에게 answer 이벤트 전송
      partnerSocket.emit('answer', {
        answer: data.answer,
        socketId: socket.id,
      });
    });

    // 클라이언트가 ice-candidate 이벤트를 보낼 때
    socket.on('ice-candidate', (data) => {
      const partnerSocket = socket.partnerSocket;

      // partnerSocket에게 ice-candidate 이벤트 전송
      partnerSocket.emit('ice-candidate', {
        candidate: data.candidate,
        socketId: socket.id,
      });
    });
  }
}

export default SocketManager;
