import { WebRTCEvents } from '../constants';

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
  }
}

export default new WebRTCService();
