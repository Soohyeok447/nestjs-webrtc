import rateLimit from "express-rate-limit";

export const throttle = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    message: '최대 요청 횟수를 초과했습니다. 잠시후 다시 시도해주세요.'
  }
});