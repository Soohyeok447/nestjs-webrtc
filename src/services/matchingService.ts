import UserRepository from './../repositories/userRepository';
import ImagesRepository from './../repositories/imageRepository';
import { NotFoundUserException } from './../exceptions/users';
import { NotFoundImagesException } from './../exceptions/images/NotFoundImagesException';
import { User } from './../models/userModel';
import { Images } from './../models/imagesModel';
import { Socket } from 'socket.io';

class MatchingService {
  // 매칭 대기 및 pending된 User Set
  private waitingUsers: Map<string, Socket>;
  private pendingUsers: Map<string, Socket>;

  constructor() {
    this.waitingUsers = new Map<string, Socket>();
    this.pendingUsers = new Map<string, Socket>();
  }

  /**
   * 매칭을 시작
   */
  public async startMatching(socket: Socket, userId: string) {
    console.log(
      'startMatching 발생. waitingUsers.size',
      this.waitingUsers.size,
    );

    // 이미 매칭 대기중인지 확인
    if (socket['status'] !== 'idle') {
      socket.emit('alreadyWaiting');

      return;
    }

    //소켓의 status를 waiting으로 설정
    socket['status'] = 'waiting';

    try {
      const currentUser: User = await UserRepository.findById(userId);

      if (!currentUser) throw new NotFoundUserException();

      const matchedUser = await this.findUser(currentUser);

      if (!matchedUser) this.waitingUsers.set(userId, socket);
      else {
        await this.introduceEachUsers(
          socket,
          matchedUser.socket,
          currentUser,
          matchedUser.user,
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 매칭 조건에 맞는 유저 찾기
   * TODO 매칭 알고리즘
   */
  private async findUser(currentUser: User) {
    for (const [userId, matchedUserSocket] of this.waitingUsers) {
      try {
        // 본인은 제외하고 다른 유저들을 find
        if (
          userId !== currentUser.id &&
          matchedUserSocket['status'] !== 'matched'
        ) {
          //TODO 실제 매칭 조건 추가 (gender, interests, purpose 등)

          const matchedUser = await UserRepository.findById(userId);

          if (!matchedUser) throw new NotFoundUserException();

          this.waitingUsers.delete(userId);

          return { user: matchedUser, socket: matchedUserSocket };
        }
      } catch (error) {
        console.log(error);
      }
    }

    return null;
  }

  /**
   * 유저들을 서로 소개
   */
  private async introduceEachUsers(
    socketA: Socket,
    socketB: Socket,
    userA: User,
    userB: User,
  ) {
    const userAImages: Images = await ImagesRepository.findByUserId(userA.id);
    const userBImages: Images = await ImagesRepository.findByUserId(userB.id);

    if (!userAImages || !userBImages) throw new NotFoundImagesException();

    //TODO 추후 room정보와 userA, userB의 id 저장 (web RTC 및 logging)
    const roomName = `room-${userA.id}-${userB.id}`;
    socketA.join(roomName);
    socketB.join(roomName);

    //소개 매칭이 되었으므로 waiting Set에 유저 2명 제거
    this.waitingUsers.delete(userA.id);
    this.waitingUsers.delete(userB.id);

    this.pendingUsers.set(userA.id, socketA);
    this.pendingUsers.set(userB.id, socketB);

    const userAInfo = {
      id: userA.id,
      gender: userA.gender,
      interests: userA.interests,
      purpose: userA.purpose,
      nickname: userA.nickname,
      location: userA.location,
      profileUrl: userAImages.urls[0],
    };

    const userBInfo = {
      id: userB.id,
      gender: userB.gender,
      interests: userB.interests,
      purpose: userB.purpose,
      nickname: userB.nickname,
      location: userB.location,
      profileUrl: userBImages.urls[0],
    };

    //서로 상대 socket 저장
    socketA['matchedUserSocket'] = socketB;
    socketB['matchedUserSocket'] = socketA;

    //서로 상대 userId 저장
    socketA['matchedUserId'] = userB.id;
    socketB['matchedUserId'] = userA.id;

    //소켓의 status를 pending으로 변경
    socketA['status'] = 'pending';
    socketB['status'] = 'pending';

    console.log('매칭대기 성공했습니다. 서로 소개합니다. [서로 소개 이후]');
    console.log('waitingUsers.size', this.waitingUsers.size);
    console.log('pendingUsers.size', this.pendingUsers.size);

    // 클라이언트에게 상대방 정보를 전달
    socketA.emit('introduceEachUsers', userBInfo);
    socketB.emit('introduceEachUsers', userAInfo);

    //TODO 타임아웃
    setTimeout(() => {
      if (
        socketA.connected &&
        socketB.connected &&
        socketA['status'] === 'pending' &&
        socketB['status'] === 'pending'
      ) {
        // response property 초기화
        socketA['response'] = null;
        socketB['response'] = null;

        socketA['status'] = 'idle';
        socketB['status'] = 'idle';

        //매칭이 안되었으므로 pending Set에 유저 2명 삭제
        this.pendingUsers.delete(userA.id);
        this.pendingUsers.delete(userB.id);

        socketA.leave(roomName);
        socketB.leave(roomName);

        //매칭 실패 result를 클라이언트로 emit
        socketA.emit('matchResult', false);
        socketB.emit('matchResult', false);

        console.log('timeOut으로 매칭 실패했습니다. [timeOut 이후 ]');
        console.log('waitingUsers.size', this.waitingUsers.size);
        console.log('pendingUsers.size', this.pendingUsers.size);

        //re matching
        setTimeout(() => {
          socketA.emit('reMatch');
        }, 1000);

        setTimeout(() => {
          socketB.emit('reMatch');
        }, 3000);
      }
    }, 10000);
  }

  /**
   * Accept 또는 Decline 처리
   */
  public handleUserResponse(
    socket: Socket,
    matchedUserSocket: Socket,
    userId: string,
    matchedUserId: string,
    response: string,
  ) {
    // socket property에 response 정보 저장
    if (response === 'accept') {
      socket['response'] = 'accept';
    } else {
      socket['response'] = 'decline';
    }

    // socket response 정보가 상호 accept일 때
    if (
      socket['response'] === 'accept' &&
      matchedUserSocket['response'] === 'accept'
    ) {
      // response property 초기화
      socket['response'] = null;
      matchedUserSocket['response'] = null;

      // 클라이언트에게 matchResult true로 emit
      socket.emit('matchResult', true);
      matchedUserSocket.emit('matchResult', true);

      // 소켓의 status를 matched로 저장
      socket['status'] = 'matched';
      matchedUserSocket['status'] = 'matched';

      // 매칭이 되었으니 pendingUsers Set에서 매칭된 유저 2명 제거
      this.pendingUsers.delete(userId);
      this.pendingUsers.delete(matchedUserId);

      console.log(
        '상호 accept로 인해 매칭 성공했습니다. [매칭 상호 accept 이후]',
      );
      console.log('waitingUsers.size', this.waitingUsers.size);
      console.log('pendingUsers.size', this.pendingUsers.size);
    }

    //TODO 둘 중 한명이라도 decline을 선택했을 때
    if (
      socket['response'] === 'decline' ||
      matchedUserSocket['response'] === 'decline'
    ) {
      // response property 초기화
      socket['response'] = null;
      matchedUserSocket['response'] = null;

      // 클라이언트에게 matchResult false로 emit
      socket.emit('matchResult', false);
      matchedUserSocket.emit('matchResult', false);

      // 소켓의 status를 idle로 설정
      socket['status'] = 'idle';
      matchedUserSocket['status'] = 'idle';

      // 매칭이 안되었으니 pendingUsers Set에서 매칭된 유저 2명 제거
      this.pendingUsers.delete(userId);
      this.pendingUsers.delete(matchedUserId);

      console.log('decline되어서 매칭 실패했습니다. [매칭 declined 이후]');
      console.log('waitingUsers.size', this.waitingUsers.size);
      console.log('pendingUsers.size', this.pendingUsers.size);

      //re matching
      setTimeout(() => {
        socket.emit('reMatch');
      }, 1000);

      setTimeout(() => {
        matchedUserSocket.emit('reMatch');
      }, 3000);
    }
  }

  /**
   * Disconnect 처리
   */
  public handleDisconnect(socket: Socket) {
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
    if (socket['status'] === 'pending' || socket['status'] === 'matched') {
      const matchedUserSocket = socket['matchedUserSocket'];

      // 상대방 소켓의 status를 idle로 변경
      matchedUserSocket['status'] = 'idle';

      // 상대방 response를 null로 변경
      matchedUserSocket['response'] = null;

      // 상대에게 matchedUserDisconnected 이벤트 전송 (다시 매칭 시도)
      matchedUserSocket.emit('matchedUserDisconnected');
    }
  }

  public getUserSocketUsingUserId(id: string): Socket | null {
    // userId를 이용하여 pendingUsers Set 에서 해당 유저의 Socket을 찾음
    for (const [userId, socket] of this.pendingUsers) {
      if (userId === id) {
        return socket;
      }
    }
    return null;
  }
}

export default new MatchingService();
