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

export type OfferEvent = {
  // offer: RTCSessionDescriptionInit;
  offer: any;
  roomName: string;
};

export type AnswerEvent = {
  // answer: RTCSessionDescriptionInit;
  answer: any;
  roomName: string;
};

export type IceEvent = {
  // ice: RTCIceCandidate;
  ice: any;
  roomName: string;
};
