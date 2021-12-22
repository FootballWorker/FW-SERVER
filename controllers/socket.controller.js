import { Server } from "socket.io";

import Chat from "./../models/chat.model.js";

export default (server) => {
  const io = new Server(server, { cors: process.env.PORT });

  io.on("connection", function (socket) {
    socket.on("join chat room", (data) => {
      console.log('User Joined.');
      socket.join(data.room);
    });
    socket.on("new message", (data) => {
      console.log("Message sent")
      backFunc(data.messageInfo, data.room);
    });
    socket.on("leave chat room", (data) => {
      console.log('User Left.')
      socket.leave(data.room);
    });
  });
  const backFunc = async (message, chat) => {
    try {
      let result = await Chat.findOneAndUpdate(
        { _id: chat },
        { $push: { messages: message },$pull : {readBy : {$nin : message?.sender}} },
        { new: true }
      )
        .populate("users","_id name photo")
        .populate("messages.sender", "_id name")
      io.to(chat).emit("new message", result.messages.at(-1));
    } catch (err) {
      console.log(err);
    }
  };
  
};
