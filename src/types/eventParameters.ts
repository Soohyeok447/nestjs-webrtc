export type RespondToIntroduce = {
  userId: string;
  response: 'accept' | 'decline';
};

export type StartMatching = {
  userId: string;
};

export type CancelMatching = {
  userId: string;
};
