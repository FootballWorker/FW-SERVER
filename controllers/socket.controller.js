import { Server } from "socket.io";

import Chat from "./../models/chat.model.js";

export default (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENTURI,
      methods: ["GET", "POST" , "PUT"],
    },
  });

  io.on("connection", function (socket) {
    socket.on("join chat room", (data) => {
      socket.join(data.room);
    });
    socket.on("leave chat room", (data) => {
      socket.leave(data.room);
    });
    socket.on("new message", (data) => {
      backFunc(data.messageInfo, data.room);
    });
  });
  const backFunc = async (message, chat) => {
    try {
      let result = await Chat.findOneAndUpdate(
        { _id: chat },
        {
          $push: { messages: message },
          $pull: { readBy: { $nin: message?.sender } },
        },
        { new: true }
      )
        .populate("users", "_id name photo")
        .populate("messages.sender", "_id name")
        .exec()
      io.to(chat).emit("new message", result.messages?.at(-1));
    } catch (err) {
      console.log(err);
    }
  };
};
