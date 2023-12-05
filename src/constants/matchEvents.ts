export enum MatchEvents {
  NOT_IDLE = 'not_idle',
  NOT_WAITING = 'not_waiting',
  INTRODUCE_EACH_USER = 'introduce_each_user',
  MATCH_RESULT = 'match_result',
  RESTART_MATCHING_REQUEST = 'restart_matching_request',
  PARTNER_DISCONNECTED = 'partner_disconnected',
  START_MATCHING = 'start_matching',
  CANCEL_MATCHING = 'cancel_matching',
  RESPOND_TO_INTRODUCE = 'respond_to_introduce',
  INVALID_RESPOND_TO_INTRODUCE = 'invalid_respond_to_introduce',
}
