import { WebRTCEvents } from '../constants';
import MatchingService from './matchingService';

const WEBCHAT_TIMEOUT_DURATION = 1000 * 60 * 10;

class WebRTCService {
  public handleSignalingStarter({ socket }) {
    socket.to(socket.room).emit(WebRTCEvents.START_WEBRTC_SIGNALING, {
      roomName: socket.room,
    });
  }

  public handleOffer({ socket, offer }) {
    socket.to(socket.room).emit(WebRTCEvents.OFFER, { offer });
  }

  public handleAnswer({ socket, answer }) {
    socket.to(socket.room).emit(WebRTCEvents.ANSWER, { answer });
  }

  public handleIce({ socket, ice }) {
    socket.to(socket.room).emit(WebRTCEvents.ICE, { ice });

    const partnerSocket = socket.partnerSocket;

    // 혹여나 소개매칭에서 설정된 timeOut중 해제되지 않은 timeOut이 있다면 초기화
    if (socket.timeOut) {
      clearTimeout(socket.timeOut);

      socket.timeOut = null;
    }

    // webchat 만료를 위한 timeOut 설정
    socket.timeOut = partnerSocket.timeOut = setTimeout(
      () =>
        MatchingService.webchatTimeOut({
          socket: partnerSocket,
          userId: socket.partnerUserId,
        }),
      WEBCHAT_TIMEOUT_DURATION,
    );
  }
}

export default new WebRTCService();
