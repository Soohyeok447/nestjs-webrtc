import mongoose, { ConnectOptions } from 'mongoose';

export function setMongoose() {
  mongoose
    .connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      dbName: process.env.DB_NAME,
    } as ConnectOptions)
    .then(() => {
      console.log('DB 연결됨');
    })
    .catch((err) => {
      console.log('DB 연결 실패', err);
    });
}
