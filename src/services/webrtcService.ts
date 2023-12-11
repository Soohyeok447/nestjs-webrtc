class WebRTCService {
  public handleOffer({ socket, offer, roomName }) {
    socket.to(roomName).emit('offer', { offer, roomName });
  }

  public handleAnswer({ socket, answer, roomName }) {
    socket.to(roomName).emit('answer', { answer });
  }

  public handleIce({ socket, ice, roomName }) {
    socket.to(roomName).emit('ice', { ice });
  }
}

export default new WebRTCService();
