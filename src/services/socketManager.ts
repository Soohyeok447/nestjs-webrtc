import { Server, Socket } from 'socket.io';
import MatchingService from './matchingService';

class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public initialize() {
    this.io.on('connection', (socket: Socket) => {
      // console.log(this.io.sockets.adapter.sids);
      console.log(socket.id, '접속');

      // 소켓 status를 idle로 설정
      socket['status'] = 'idle';

      // 소개매칭 대기 시작
      socket.on('start_matching', async (userId) => {
        MatchingService.startMatching(socket, userId);
      });

      // 소개매칭 대기 취소
      socket.on('cancel_matching', async (userId) => {
        MatchingService.cancelMatching(socket, userId);
      });

      // 소개매칭 phase에서 Accept 또는 Decline 처리
      socket.on(
        'respond_to_introduce',
        (myUserId: string, myResponse: string) => {
          const partnerUserId = socket['partnerUserId'];

          const partnerSocket = socket['partnerSocket'];

          if (partnerSocket) {
            MatchingService.handleUserResponse(
              socket,
              partnerSocket,
              myUserId,
              partnerUserId,
              myResponse,
            );
          } else {
            //TODO 클라이언트를 위한 이벤트 생성
            console.log('소켓이 없습니다.');
          }
        },
      );

      socket.on('disconnect', () => {
        console.log(socket.id, '접속 해제');

        MatchingService.handleDisconnect(socket);
      });
    });
  }
}

export default SocketManager;
