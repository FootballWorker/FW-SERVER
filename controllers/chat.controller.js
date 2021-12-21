import errorHandler from "./../helpers/dbErrorHandler.js";
import Chat from "./../models/chat.model.js";
import Team from "./../models/team.model.js";
import User from "./../models/user.model.js";

const create = async (req, res) => {
  const { userId, name } = req.body;

  if (!userId) {
    return res.status(400).json({
      error: "User not found!",
    });
  }
  try {
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.auth._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "_id name photo")
      .populate("messages.sender", "_id name photo");

    // isChat = await User.populate(isChat, {
    //   path: "latestMessage.sender",
    //   select: "name pic email",
    // });

    if (isChat?.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: req.body.name,
        isGroupChat: false,
        users: [req.auth._id, req.body.userId],
      };

      let createdChat = new Chat(chatData);
      try {
        let result = await createdChat.save();
        res.json(result);
      } catch (error) {
        return res.status(400).json({
          error: "Something went wrong in our servers!",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const chatByID = async (req, res, next, id) => {
  try {
    let chat = await Chat.findById(id)
      .populate("users", "_id name photo")
      .populate("messages.sender", "_id name photo")
      .populate("groupAdmin", "_id name")
      .populate("readBy", "_id name")
      .exec();
    if (!chat) {
      return res.status(404).json({
        error: "No chat found!",
      });
    }
    req.chat = chat;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve chat!",
    });
  }
};

const read = async (req, res) => {
  res.json(req.chat);
};

const list = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $in: req.profile._id },
    })
      .sort("-updatedAt")
      .populate("users", "_id name")
      .populate("messages.sender", "_id name")
      .exec();
    res.json(chats);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const unRead = async (req, res) => {
  try {
    let result = await Chat.find({
      users: { $in: req.auth._id },
      readBy: { $nin: req.auth._id },
    });
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: "Not Found",
    });
  }
};

const createTeamChat = async (req, res) => {
  try {
    let team = await Team.findOne({ president: req.auth._id });
    let users = [];

    let president = team.president;
    if (president) {
      users.push(president);
    }
    let vices = team.vicePresident;
    if (vices) {
      users.push(...vices);
    }
    let manager = team.manager;
    if (manager) {
      users.push(manager);
    }
    let coaches = team.coach;
    if (coaches) {
      users.push(...coaches);
    }
    let scouts = team.scout;
    if (scouts) {
      users.push(...scouts);
    }
    let youths = team.youth;
    if (youths) {
      users.push(...youths);
    }
    console.log(users);

    let newChat = new Chat(req.body);
    newChat.isGroupChat = true;
    newChat.groupAdmin = req.auth._id;
    newChat.users = users;

    let result = await newChat.save();
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listGroups = async (req, res) => {
  try {
    let chats = await Chat.find({
      isGroupChat: true,
      users: { $in: req.auth._id },
    })
      .populate("users", "_id name")
      .populate("messages.sender", "_id name")
      .exec();
    res.json(chats);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    console.log(chatName);

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "_id name photo")
      .populate("messages.sender", "_id name photo")
      .populate("groupAdmin", "_id name")
      .populate("readBy", "_id name")
      .exec();

    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "_id name")
      .populate("groupAdmin", "_id name")
      .exec();

    res.json(removed);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "_id name photo")
      .populate("messages.sender", "_id name photo")
      .populate("groupAdmin", "_id name")
      .populate("readBy", "_id name")
      .exec();

    res.json(added);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listTeamWorkers = async (req, res) => {
  try {
    let users = await User.find({ team: req.team._id }).select(
      "_id name photo"
    );
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const isPresident = async (req, res, next) => {
  try {
    let team = await Team.findOne({ president: req.auth._id });
    if (!team) {
      ("You are not allowed to set this meeting up!");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const isGroupAdmin = async (req, res, next) => {
  try {
    let chat = await Chat.findOne(
      { _id: req.body.chatId },
      { groupAdmin: req.auth._id }
    );
    if (!chat) {
      ("You are not allowed to carry out this operation!");
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const isIncluded = async (req, res, next) => {
  try {
    console.log(req.body.chatId, req.body.userId);
    const isChat = await Chat.findOne({
      _id: req.body.chatId,
      isGroupChat: true,
      users: { $in: req.body.userId },
    });
    console.log(isChat);
    if (isChat) {
      return res.status("400").json({
        error: "User already in the meeting!",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const addReaded = async (req, res, next) => {
  try {
    await Chat.findOneAndUpdate(
      { _id: req.chat._id },
      { $push: { readBy: req.auth._id } },
      { new: true }
    );
    next();
  } catch (error) {
    console.log(error);
  }
};

export default {
  create,
  chatByID,
  read,
  list,
  listGroups,
  unRead,
  renameGroup,
  addToGroup,
  removeFromGroup,
  createTeamChat,
  listTeamWorkers,
  isPresident,
  isGroupAdmin,
  isIncluded,
  addReaded,
};
