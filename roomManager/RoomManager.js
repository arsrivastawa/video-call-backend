class Room {
  constructor(id, user1, user2) {
    this.id = id;
    this.user1 = user1;
    this.user2 = user2;
  }
}

class RoomManager {
  rooms;
  constructor() {
    this.rooms = [];
  }

  createRoom(user1, user2) {
    const roomId = this.generateRoomId();

    this.rooms.push(new Room(roomId, user1, user2));
    user1.socket.emit("room-created", roomId);
    user2.socket.emit("room-created", roomId);
    console.log(roomId, user1.socket.id, user2.socket.id);

    user1.socket.emit("send-sdp-to-server", { roomId, to: user2.socket.id });
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
  }
}

module.exports = RoomManager;
