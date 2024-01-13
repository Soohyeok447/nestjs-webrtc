import { Server, Socket } from 'socket.io';
import MatchingService from './matchingService';
import { MatchEvents, WebRTCEvents } from '../constants';
import {
  AnswerEvent,
  CancelMatchingEvent,
  IceEvent,
  LeaveWebchatEvent,
  OfferEvent,
  RequestFaceRecognition,
  RespondToIntroduceEvent,
  RespondFaceRecognition,
  StartMatchingEvent,
} from '../types/eventParameters';
import WebRTCService from './webrtcService';

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
    socket.on(
      MatchEvents.START_MATCHING,
      async ({ userId }: StartMatchingEvent) => {
        MatchingService.startMatching({ socket, userId });
      },
    );

    // 소개매칭 대기 취소
    socket.on(
      MatchEvents.CANCEL_MATCHING,
      async ({ userId }: CancelMatchingEvent) => {
        MatchingService.cancelMatching({ socket, userId });
      },
    );

    // 소개매칭 phase에서 Accept 또는 Decline 처리
    socket.on(
      MatchEvents.RESPOND_TO_INTRODUCE,
      ({ userId: myUserId, response: myResponse }: RespondToIntroduceEvent) => {
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

    // 화상채팅 도중 끊음
    socket.on(
      MatchEvents.LEAVE_WEBCHAT,
      async ({ userId }: LeaveWebchatEvent) => {
        MatchingService.leaveWebchat({ socket, userId });
      },
    );

    // 화상채팅 도중 얼굴공개 요청을 받음
    socket.on(
      MatchEvents.REQUEST_FACE_RECOGNITION,
      async ({ userId }: RequestFaceRecognition) => {
        MatchingService.requestFaceRecognition({ socket, userId });
      },
    );

    // 화상채팅 도중 얼굴공개 요청을 받은 파트너가 응답을 함
    socket.on(
      MatchEvents.RESPOND_FACE_RECOGNITION,
      async ({ userId, response, receivedTime }: RespondFaceRecognition) => {
        MatchingService.respondFaceRecognition({
          socket,
          userId,
          response,
          receivedTime,
        });
      },
    );
  }

  private setupWebRTCListener(socket: Socket) {
    // 매칭성사 이후 webrtc signaling을 시작하는 이벤트 (2명 중 1명이 emit함)
    socket.on(WebRTCEvents.START_WEBRTC_SIGNALING, () => {
      WebRTCService.handleSignalingStarter({ socket });
    });

    // 클라이언트가 offer 이벤트를 보낼 때 offer받고 파트너에게 전송
    socket.on(WebRTCEvents.OFFER, ({ offer }: OfferEvent) => {
      WebRTCService.handleOffer({ socket, offer });
    });

    // 클라이언트가 answer 이벤트를 보낼 때 answer받고 파트너에게 전송
    socket.on(WebRTCEvents.ANSWER, ({ answer }: AnswerEvent) => {
      WebRTCService.handleAnswer({ socket, answer });
    });

    // 클라이언트가 ice-candidate 이벤트를 보낼 때 ice data받고 파트너에게 전송
    socket.on(WebRTCEvents.ICE, ({ ice }: IceEvent) => {
      WebRTCService.handleIce({ socket, ice });
    });
  }
}

export default SocketManager;
