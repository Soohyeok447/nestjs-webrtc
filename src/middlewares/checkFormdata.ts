import { Request, Response, NextFunction } from 'express';

export const checkFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.headers['content-type'] &&
    req.headers['content-type'].includes('multipart/form-data')
  ) {
    next();
  } else {
    res.status(400).json({ message: '요청 형식이 올바르지 않습니다.' });
  }
};
