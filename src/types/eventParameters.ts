export type RespondToIntroduceEvent = {
  userId: string;
  response: 'accept' | 'decline';
};

export type StartMatchingEvent = {
  userId: string;
};

export type CancelMatchingEvent = {
  userId: string;
};

export type LeaveWebchatEvent = {
  userId: string;
};

export type RequestFaceRecognition = {
  userId: string;
};

export type RespondFaceRecognition = {
  userId: string;
  response: 'accept' | 'decline';
};

export type OfferEvent = {
  offer: RTCSessionDescriptionInit;
  roomName: string;
};

export type AnswerEvent = {
  answer: RTCSessionDescriptionInit;
  roomName: string;
};

export type IceEvent = {
  ice: RTCIceCandidate;
  roomName: string;
};
