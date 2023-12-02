import { Server, Socket } from 'socket.io';
import MatchingService from './matchingService';

class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public initialize() {
    this.io.on('connection', (socket: Socket) => {
      console.log(this.io.sockets.adapter.sids);

      //소켓 status를 idle로 설정
      socket['status'] = 'idle';

      // 매칭 시작
      socket.on('startMatching', async (userId) => {
        MatchingService.startMatching(socket, userId);
      });

      // Accept 또는 Decline 처리
      socket.on(
        'userResponse',
        (userId: string, matchedUserId: string, response: string) => {
          const matchedUserSocket =
            MatchingService.getUserSocketUsingUserId(matchedUserId);

          if (matchedUserSocket) {
            MatchingService.handleUserResponse(
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

        MatchingService.handleDisconnect(socket);
      });
    });
  }
}

export default SocketManager;
