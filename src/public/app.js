/* eslint-disable no-undef */
const socket = io();

const logList = document.getElementById('log-list');
const refreshButton = document.getElementById('refresh');
const onlineUsersList = document.getElementById('online-users-list');
const onlineUsersCount = document.getElementById('online-users-count');

const timer = document.getElementById('timer');

let countdown = 10;

refreshButton.addEventListener('click', handleRefreshButtonClick);

function updateTimer() {
  timer.textContent = countdown;
  countdown--;

  if (countdown < 0) {
    refresh();
  }
}

setInterval(updateTimer, 1000);

socket.on('send-logs', (logs) => {
  logList.innerHTML = '';

  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];

    const logListItem = document.createElement('li');

    logListItem.innerHTML = `<b>[${getFormattedDateTime(
      log.createdAt,
    )}]</b><br>${log.content}`;

    logList.appendChild(logListItem);
  }
});

function getFormattedDateTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function handleRefreshButtonClick() {
  refresh();
}

function refresh() {
  socket.emit('request-logs');

  console.log('로그 요청');

  countdown = 10;
}

socket.on('update-online-users', ({ users, userCount }) => {
  updateOnlineUsers({ users, userCount });
});

function updateOnlineUsers({ users, userCount }) {
  onlineUsersList.innerHTML = '';
  onlineUsersCount.innerHTML = `접속 중 - ${userCount}`;

  users.forEach((user) => {
    const listItem = document.createElement('li');
    listItem.textContent = user;
    onlineUsersList.appendChild(listItem);
  });
}
