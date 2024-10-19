const RoomManager = require("../roomManager/RoomManager");

class User {
  constructor(name, socket) {
    this.name = name;
    this.socket = socket;
  }
}

class UserManager {
  users;
  waitingQueue;
  roomManager;
  constructor() {
    this.users = [];
    this.waitingQueue = [];
    this.roomManager = new RoomManager();
  }
  addUser(name, socket) {
    this.users.push(new User(name, socket));
    this.waitingQueue.push(new User(name, socket));

    this.clearQueue();
    this.eventHandlers(socket);
  }

  removeUser(socket) {
    this.users = this.users.filter((user) => user.socket.id !== socket.id);
    this.waitingQueue = this.waitingQueue.filter(
      (user) => user.socket.id !== socket.id
    );
  }

  eventHandlers(socket) {
    socket.on("sdp-from-user", (data) => {
      const { sdp, roomId, type, to } = data;

      const recievingUser = this.users.find((user) => user.socket.id === to);

      if (recievingUser) {
        recievingUser.socket.emit("sdp-from-server", {
          sdp,
          roomId,
          to: socket.id,
          type,
        });
      } else {
        this.waitingQueue.push(to);
      }
    });

    socket.on("ice-candidate-from-user", (data) => {
      const { candidate, roomId, to } = data;

      const recievingUser = this.users.find((user) => user.socket.id === to);

      if (recievingUser) {
        recievingUser.socket.emit("ice-candidate-from-server", {
          candidate,
        });
      }
    });
  }

  clearQueue() {
    if (this.waitingQueue.length < 2) return;
    const user1 = this.waitingQueue.pop();
    // this.waitingQueue = this.shuffleArray(this.waitingQueue);
    const user2 = this.waitingQueue.pop();

    this.roomManager.createRoom(user1, user2);
    // console.log("first", this.waitingQueue.length);

    this.clearQueue();
  }

  shuffleArray(queue) {
    for (let i = queue.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const randomIndex = Math.floor(Math.random() * (i + 1));

      // Swap elements at index i and randomIndex
      [queue[i], queue[randomIndex]] = [queue[randomIndex], queue[i]];
    }
    return queue;
  }
}

module.exports = UserManager;
