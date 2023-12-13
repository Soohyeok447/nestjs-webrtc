import UserRepository from './../repositories/userRepository';
import ImagesRepository from './../repositories/imageRepository';
import { NotFoundUserException } from './../exceptions/users';
import { NotFoundImagesException } from './../exceptions/images/NotFoundImagesException';
import { User } from './../models/userModel';
import { Images } from './../models/imagesModel';
import { Socket } from 'socket.io';
import { MatchEvents } from '../constants';

const TIMEOUT_DURATION = 10 * 1000;

class MatchingService {
  // 소개매칭 대기 및 pending된 User Set
  private waitingUsers: Map<string, Socket>;
  private pendingUsers: Map<string, Socket>;

  constructor() {
    this.waitingUsers = new Map<string, Socket>();
    this.pendingUsers = new Map<string, Socket>();
  }

  /**
   * 소개매칭 대기 시작
   */
  public async startMatching({
    socket,
    userId,
  }: {
    socket: Socket;
    userId: string;
  }) {
    console.log(
      'startMatching 발생. waitingUsers.size',
      this.waitingUsers.size,
    );

    // socket의 status가 idle인지 확인
    if (socket.status !== 'idle') {
      socket.emit(MatchEvents.NOT_IDLE);

      return;
    }

    //소켓의 status를 waiting으로 설정
    this.setSocketStatusToWaiting(socket);

    try {
      // 매칭을 시작한 유저가 DB에 저장된 유저인지 확인
      const currentUser: User = await UserRepository.findById(userId);

      //없으면 NotFoundException을 throw
      if (!currentUser) throw new NotFoundUserException();

      // 파트너를 찾음
      const partner = await this.findPartner(currentUser);

      // 본인을 제외한 waiting중인 파트너가 없으면 클라이언트를 waitingUsers Set에 저장
      if (!partner) {
        this.waitingUsers.set(userId, socket);
      } else {
        // 파트너를 찾으면 서로 소개 매칭을 잡음
        await this.introduceUsers({
          mySocket: socket,
          partnerSocket: partner.socket,
          me: currentUser,
          partner: partner.user,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 매칭 조건에 맞는 본인을 제외한 유저 찾기
   * TODO 매칭 알고리즘
   */
  private async findPartner(currentUser: User) {
    for (const [partnerId, partnerSocket] of this.waitingUsers) {
      try {
        // 본인은 제외하고 다른 waiting중인 partner들을 find
        if (
          partnerId !== currentUser.id &&
          partnerSocket.status === 'waiting'
        ) {
          //TODO 실제 매칭 조건 추가 (gender, interests, purpose 등)

          const partner = await UserRepository.findById(partnerId);

          if (!partner) throw new NotFoundUserException();

          return { user: partner, socket: partnerSocket };
        }
      } catch (error) {
        throw error;
      }
    }

    //본인을 제외하고 찾을 partner가 없으면 null을 return
    return null;
  }

  /**
   * 유저들을 서로 소개
   */
  private async introduceUsers({
    mySocket,
    partnerSocket,
    me,
    partner,
  }: {
    mySocket: Socket;
    partnerSocket: Socket;
    me: User;
    partner: User;
  }) {
    // 기존 setTimeOut 타이머 취소
    this.clearTimeoutIfExists(mySocket);
    this.clearTimeoutIfExists(partnerSocket);

    const userAImages: Images = await ImagesRepository.findByUserId(me.id);
    const userBImages: Images = await ImagesRepository.findByUserId(partner.id);

    if (!userAImages || !userBImages) throw new NotFoundImagesException();

    // 소개 매칭이 되었으므로 waitingUsers Set에 나와 파트너를 제거
    this.waitingUsers.delete(me.id);
    this.waitingUsers.delete(partner.id);

    // 매칭 성사 대기 확인을 위해 pendingUsers Set에 나와 파트너를 저장
    this.pendingUsers.set(me.id, mySocket);
    this.pendingUsers.set(partner.id, partnerSocket);

    // 서로 소개하기 위한 정보 매핑
    const userAInfo = this.mapUserInfo({ user: me, images: userAImages });
    const userBInfo = this.mapUserInfo({
      user: partner,
      images: userBImages,
    });

    // 서로 파트너의 socket 저장
    mySocket.partnerSocket = partnerSocket;
    partnerSocket.partnerSocket = mySocket;

    //서로 파트너의 userId 저장
    mySocket.partnerUserId = partner.id;
    partnerSocket.partnerUserId = me.id;

    //소켓의 status를 pending으로 변경
    this.setSocketStatusToPending(mySocket);
    this.setSocketStatusToPending(partnerSocket);

    console.log('매칭대기 성공했습니다. 서로 소개합니다. [서로 소개 이후]');
    console.log('waitingUsers.size', this.waitingUsers.size);
    console.log('pendingUsers.size', this.pendingUsers.size);

    // 클라이언트에게 상대방 정보를 전달 introduce_each_user 이벤트를 emit
    mySocket.emit(MatchEvents.INTRODUCE_EACH_USER, userBInfo);
    partnerSocket.emit(MatchEvents.INTRODUCE_EACH_USER, userAInfo);

    // 타임아웃
    mySocket.timeOut = partnerSocket.timeOut = setTimeout(
      () =>
        this.handleMatchingTimeout({
          mySocket,
          partnerSocket,
          me,
          partner,
        }),
      TIMEOUT_DURATION,
    );
  }

  /**
   * 소개매칭 타임아웃 핸들러
   */
  private handleMatchingTimeout({
    mySocket,
    partnerSocket,
    me,
    partner,
  }): void {
    if (
      mySocket.connected &&
      partnerSocket.connected &&
      mySocket.status === 'pending' &&
      partnerSocket.status === 'pending'
    ) {
      // response property 초기화
      mySocket.response = null;
      partnerSocket.response = null;

      // 소켓 status를 idle로 설정
      this.setSocketStatusToIdle(mySocket);
      this.setSocketStatusToIdle(partnerSocket);

      //매칭이 안되었으므로 pending Set에 유저 2명 삭제
      this.pendingUsers.delete(me.id);
      this.pendingUsers.delete(partner.id);

      //매칭 실패 result를 클라이언트로 emit
      mySocket.emit(MatchEvents.MATCH_RESULT, { result: false });
      partnerSocket.emit(MatchEvents.MATCH_RESULT, { result: false });

      console.log('timeOut으로 매칭 실패했습니다. [timeOut 이후]');
      console.log('waitingUsers.size', this.waitingUsers.size);
      console.log('pendingUsers.size', this.pendingUsers.size);

      //re matching
      if (mySocket.connected) {
        setTimeout(() => {
          mySocket.emit(MatchEvents.RESTART_MATCHING_REQUEST);
        }, 1000);
      }

      if (partnerSocket.connected) {
        setTimeout(() => {
          partnerSocket.emit(MatchEvents.RESTART_MATCHING_REQUEST);
        }, 3000);
      }
    }
  }

  /**
   * 소개매칭을 위한 유저데이터 매핑
   */
  private mapUserInfo({ user, images }: { user: User; images: Images }) {
    return {
      id: user.id,
      gender: user.gender,
      interests: user.interests,
      purpose: user.purpose,
      nickname: user.nickname,
      location: user.location,
      profileUrl: images.urls[0],
    };
  }

  /**
   * 소개 매칭에서의 Accept 또는 Decline 처리
   */
  public handleUserResponse({
    mySocket,
    partnerSocket,
    myUserId,
    partnerUserId,
    myResponse,
  }: {
    mySocket: Socket;
    partnerSocket: Socket;
    myUserId: string;
    partnerUserId: string;
    myResponse: string;
  }) {
    // 이미 매칭된 상태면 더 이상 accept와 decline이 불가능해야함
    if (mySocket.status === 'matched' && partnerSocket.status === 'matched') {
      return;
    }

    // 만약 클라이언트가 소개 매칭에서 accept를 선택했을 시
    if (myResponse === 'accept') {
      // socket response 속성을 accept로 설정
      mySocket.response = 'accept';
    } else {
      // 만약 클라이언트가 소개 매칭에서 decline을 선택했을 시
      // 바로 소개 매칭을 파토내야함

      // status property를 idle로 설정
      this.setSocketStatusToIdle(mySocket);
      this.setSocketStatusToIdle(partnerSocket);

      // response 초기화
      mySocket.response = null;
      partnerSocket.response = null;

      // 매칭이 안되었으니 pendingUsers Set에서 매칭된 유저 2명 제거
      this.pendingUsers.delete(myUserId);
      this.pendingUsers.delete(partnerUserId);

      // 클라이언트에게 match_result false로 emit
      mySocket.emit(MatchEvents.MATCH_RESULT, { result: false });
      partnerSocket.emit(MatchEvents.MATCH_RESULT, { result: false });

      console.log('decline되어서 매칭 실패했습니다. [매칭 declined 이후]');
      console.log('waitingUsers.size', this.waitingUsers.size);
      console.log('pendingUsers.size', this.pendingUsers.size);

      //re matching
      if (mySocket.connected) {
        setTimeout(() => {
          mySocket.emit(MatchEvents.RESTART_MATCHING_REQUEST);
        }, 1000);
      }

      if (partnerSocket.connected) {
        setTimeout(() => {
          partnerSocket.emit(MatchEvents.RESTART_MATCHING_REQUEST);
        }, 3000);
      }
    }

    // socket response 정보가 상호 accept일 때 (매칭이 성사됐을 때)
    if (mySocket.response === 'accept' && partnerSocket.response === 'accept') {
      // response property 초기화
      mySocket.response = null;
      partnerSocket.response = null;

      // 소켓의 status를 matched로 설정
      this.setSocketStatusToMatched(mySocket);
      this.setSocketStatusToMatched(partnerSocket);

      //TODO 추후 room정보와 userA, userB의 id 저장 (web RTC 및 logging)
      const roomName = `room-${mySocket.id}-${partnerSocket.id}`;
      mySocket.join(roomName);
      partnerSocket.join(roomName);

      mySocket.room = roomName;
      partnerSocket.room = roomName;

      // 클라이언트에게 matchResult true로 emit,
      // 그리고 2명중 1명에게 webRTC signaling을 시작하도록 함
      mySocket.emit(MatchEvents.MATCH_RESULT, {
        result: true,
        initiator: true,
      });
      partnerSocket.emit(MatchEvents.MATCH_RESULT, { result: true });

      // 매칭이 되었으니 pendingUsers Set에서 나와 파트너를 제거
      this.pendingUsers.delete(myUserId);
      this.pendingUsers.delete(partnerUserId);

      console.log(
        '상호 accept로 인해 매칭 성공했습니다. [매칭 상호 accept 이후]',
      );
      console.log('waitingUsers.size', this.waitingUsers.size);
      console.log('pendingUsers.size', this.pendingUsers.size);
    }
  }

  /**
   * Disconnect 처리
   */
  public handleDisconnect(socket: Socket) {
    //room에 join한 상태면 room에서 leave함
    if (socket.room) socket.leave(socket.room);

    // waitingUsers Set에서 삭제
    this.waitingUsers.forEach((userSocket, userId) => {
      if (userSocket === socket) {
        this.waitingUsers.delete(userId);

        console.log('나간놈 대기풀에서 삭제');
      }
    });

    // pendingUsers Set에서 삭제
    this.pendingUsers.forEach((userSocket, userId) => {
      if (userSocket === socket) {
        this.pendingUsers.delete(userId);

        console.log('나간놈 pending풀에서 삭제');
      }
    });

    // 만약 상대방과의 소개가 완료된 상태에서 disconnect 된 경우
    if (socket.status === 'pending' || socket.status === 'matched') {
      const partnerSocket = socket.partnerSocket;

      // 상대방 소켓의 status를 idle로 변경
      this.setSocketStatusToIdle(partnerSocket);

      // 상대방 timeout을 null로 변경
      partnerSocket.timeOut = null;

      // 상대방 room을 null로 변경
      partnerSocket.room = null;

      // 상대방 partnerUserId를 null로 변경
      partnerSocket.partnerUserId = null;

      // 상대방 partnerSocket을 null로 변경
      partnerSocket.partnerSocket = null;

      // 상대에게 partner_disconnected 이벤트 전송 (다시 매칭 시도)
      if (partnerSocket.connected) {
        partnerSocket.emit(MatchEvents.PARTNER_DISCONNECTED);
      }
    }
  }

  /**
   * 소개매칭 대기를 취소 함
   */
  public async cancelMatching({
    socket,
    userId,
  }: {
    socket: Socket;
    userId: string;
  }) {
    // socket의 status가 waiting인지 확인
    if (socket.status !== 'waiting') {
      socket.emit(MatchEvents.NOT_WAITING);

      return;
    }

    //소켓의 status를 idle로 설정
    this.setSocketStatusToIdle(socket);

    this.waitingUsers.delete(userId);

    console.log(
      'cancelMatching 발생. waitingUsers.size',
      this.waitingUsers.size,
    );
  }

  /**
   * 타임아웃 설정
   */
  private setTimeOutWithClear(
    socket: Socket,
    milliseconds: number,
    cb: () => void,
  ) {
    this.clearTimeoutIfExists(socket);

    socket.timeOut = setTimeout(cb, milliseconds);
  }

  /**
   * 설정된 타임아웃이 있으면 취소
   */
  private clearTimeoutIfExists(socket: Socket) {
    if (socket.timeOut) {
      clearTimeout(socket.timeOut);

      socket.timeOut = null;
    }
  }

  /**
   * 소켓의 status를 변경
   */
  private setSocketStatusToWaiting(socket: Socket) {
    socket.status = 'waiting';
  }

  private setSocketStatusToPending(socket: Socket) {
    socket.status = 'pending';
  }

  private setSocketStatusToMatched(socket: Socket) {
    socket.status = 'matched';
  }

  private setSocketStatusToIdle(socket: Socket) {
    socket.status = 'idle';
  }
}

export default new MatchingService();
