import extend from "lodash/extend.js";
import formidable from "formidable";
import fs from "fs";

import Comment from "./../models/comment.model.js";
import Notification from "./../models/notification.model.js";
import User from "./../models/user.model.js";
import Post from "./../models/post.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import { making, unMaking } from "../helpers/starSubscribe.js";
import config from "./../config/config.js";

const create = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id)
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    const ntfUser = await User.findById(req.post.postedBy)
      .populate("notifications")
      .exec();
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Could not uploaded photo",
        });
      }
      let comment = new Comment(fields);

      comment.title = req.post?.title;
      comment.commentedBy = req.auth?._id;
      comment.adherence = req.post?._id;
      comment.department = user.department?._id;
      comment.job = user.job?._id;

      if (files.imageOne) {
        comment.imageOne.data = fs.readFileSync(files.imageOne.path);
        comment.imageOne.contentType = files.imageOne.type;
      }

      try {
        let ntf = await Notification.create({
          title: "Comment to Post",
          text: ` Hey , How are you ${ntfUser.name} ? We hope you enjoy being here ! By the way , ${user.name?.toUpperCase()} have commented to your post.We thought you would like to check it out! Just click the button!`,
          from: user.name,
          forWho: ntfUser._id,
          link: `/posts/${req.post._id}`,
        });

        ntfUser.notifications.push(ntf);
        await ntfUser.save();
        let result = await comment.save();
        res.json(result);
      } catch (error) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const commentByID = async (req, res, next, id) => {
  try {
    let comment = await Comment.findById(id)
      .populate("commentedBy", "_id name")
      .populate("adherence", "_id title")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("likes", "_id name")
      .exec();
    if (!comment)
      return res.status("400").json({
        error: "Comment not found",
      });
    req.comment = comment;
    next();
  } catch (error) {
    return res.status("400").json({
      error: "Could not retrieve comment",
    });
  }
};

const imageOne = (req, res, next) => {
  res.set("Content-Type", req.comment.imageOne.contentType);
  return res.send(req.comment.imageOne.data);
};

const read = (req, res) => {
  return res.json(req.comment);
};

const list = async (req, res) => {
  try {
    let comments = await Comment.find({ adherence: req.post._id })
      .sort("-created")
      .populate("adherence", "_id title")
      .populate("commentedBy", "_id name")
      .exec();

    res.json(comments);
  } catch (error) {
    return res.status("400").json({
      error: "Could not retrieve comments belong to this post",
    });
  }
};

const listByUser = async (req, res) => {
  try {
    let comments = await Comment.find({ commentedBy: req.profile._id })
      .sort("-created")
      .populate("adherence", "_id title")
      .populate("commentedBy", "_id name")
      .exec();

    res.json(comments);
  } catch (error) {}
};

const remove = async (req, res) => {
  try {
    let comment = req.comment;
    let deletedComment = await comment.remove();
    res.json(deletedComment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// --------------------------- LIST FOR ASIDE MENUS ------------------------------------

const listRelated = async (req, res) => {
  try {
    let comments = await Comment.find({
      $and: [
        { _id: { $ne: req.comment._id } },
        { adherence: req.comment.adherence },
      ],
    })
      .populate("commentedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(comments);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const bestCommentPosts = async (req, res) => {
  try {
    let comments = await Comment.find({ adherence: req.post._id })
      .sort("-starLength")
      .limit(5)
      .populate("commentedBy")
      .exec();
    res.json(comments);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const bestCommentUsers = async (req, res) => {
  try {
    let comments = await Comment.find({ commentedBy: req.profile._id })
      .sort("-starLength")
      .limit(7)
      .populate("commentedBy")
      .exec();
    res.json(comments);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

//  ------------------------------- LIKE SYSTEM ---------------------------------------------

const like = async (req, res) => {
  making(
    Comment,
    req.body.commentId,
    "likes",
    "likeLength",
    req.body.userId,
    res
  );
};

const unlike = async (req, res) => {
  unMaking(
    Comment,
    req.body.commentId,
    "likes",
    "likeLength",
    req.body.userId,
    res
  );
};

// ------------------------------- PERMISSIONS ------------------------------------------

const isCommenter = (req, res, next) => {
  let isCommenter =
    req.comment && req.auth && req.comment.commentedBy._id == req.auth._id;
  if (!isCommenter) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  create,
  commentByID,
  imageOne,
  list,
  listByUser,
  read,
  remove,
  listRelated,
  bestCommentPosts,
  bestCommentUsers,
  like,
  unlike,
  isCommenter,
};
