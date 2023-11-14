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
      console.log('DB connected');
    })
    .catch((err) => {
      console.log('DB connection failed: ', err);
    });
}
