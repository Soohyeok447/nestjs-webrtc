// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    status: 'idle' | 'waiting' | 'pending' | 'matched';
    response?: 'accept' | null;
    partnerSocket?: Socket;
    partnerUserId?: string;
    timeOut?: NodeJS.Timeout | null;
  }
}
