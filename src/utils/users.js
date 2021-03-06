const RoomModel = require("../models/rooms");

const addUserToRoom = async ({ username, socketId, room }) => {
  try {
    const findRoom = await RoomModel.findOne({ name: room });
    if (!findRoom) {
      const newRoom = new RoomModel({
        name: room,
        members: [{ username, socketId }],
      });
      await newRoom.save();
      return { username, room };
    }

    const user = await RoomModel.findOne({
      name: room,
      "members.username": username,
    });

    if (user) {
      // if user is already in room let's update sockedId

      await RoomModel.findOneAndUpdate(
        { name: room, "members.username": username },
        { "members.$.socketId": socketId }
      );
    } else {
      // if it is not let's add it to the members
      const newRoom = await RoomModel.findOneAndUpdate(
        { name: room },
        { $addToSet: { members: { username, socketId } } }
      );
    }
    return { username, room };
  } catch (error) {
    console.log(error);
  }
};

const getUsersInRoom = async (roomName) => {
  try {
    const room = await RoomModel.findOne({ name: roomName });
    console.log(roomName, room);
    return room.members;
  } catch (error) {
    console.log(error);
  }
};

const getUserBySocket = async (roomName, socketId) => {
  try {
    const room = await RoomModel.findOne({ name: roomName });
    console.log(room);
    console.log(socketId);
    const user = room.members.find((user) => user.socketId === socketId);
    return user;
  } catch (error) {
    console.log(error);
  }
};

const removeUserFromRoom = async (socketId, roomName) => {
  try {
    const room = await RoomModel.findOne({ name: roomName });

    const username = room.members.find(
      (member) => member.socketId === socketId
    );

    await RoomModel.findOneAndUpdate(
      { name: roomName },
      { $pull: { members: { socketId } } }
    );

    return username;
  } catch (error) {}
};

module.exports = {
  addUserToRoom,
  getUsersInRoom,
  getUserBySocket,
  removeUserFromRoom,
};
