import mongoose from "mongoose";

import Post from "./../models/post.model.js";
import Player from "./../models/player.model.js";
import Comment from "./../models/comment.model.js";
import User from "./../models/user.model.js";

const totalLikeUser = async (req, res) => {
  try {
    await Post.aggregate([
      {
        $match: {postedBy: req.profile._id}
      },
      {
        $group: {
          _id: null,
          sumLikes: {
            $sum: "$likeLength",
          },
        },
      },
      { $unset: ["_id"] },
    ], function(err, result) {
      if(err){
        console.log(err)
      }else{
        res.json(result[0])
      }})
  } catch (error) {
    return res.status(400).json({
      error: "Not Found",
    });
  }
};

const totalCommentLikes = async (req, res) => {
  try {
    await Comment.aggregate([
      {
        $match: {commentedBy: req.profile._id}
      },
      {
        $group: {
          _id: null,
          sumLikes: {
            $sum: "$likeLength",
          },
        },
      },
      { $unset: ["_id"] },
    ], function(err, result) {
      if(err){
        console.log(err) 
      }else{
        res.json(result[0])
      }})
  } catch (error) {
    return res.status(400).json({
      error: "Not Found",
    });
  }
};

const totalFollowerSubscribe = async (req, res) => {
  try {
    await User.aggregate([
      {
        $match: {news: req.news._id}
      },
      {
        $group: {
          _id: null,
          sumLikes: {
            $sum: "$followerLength",
          },
        },
      },
      { $unset: ["_id"] },
    ], function(err, result) {
      if(err){
        console.log(err)
      }else{
        res.json(result[0])
      }})
  } catch (error) {
    return res.status(400).json({
      error: "Not Found",
    });
  }
};

const totalLikeNews = async (req, res) => {
  try {
    await Post.aggregate([
      {
        $match: {news: req.news._id}
      },
      {
        $group: {
          _id: null,
          sumLikes: {
            $sum: "$likeLength",
          },
        },
      },
      { $unset: ["_id"] },
    ], function(err, result) {
      if(err){
        console.log(err)
      }else{
        res.json(result[0])
      }})
  } catch (error) {
    return res.status(400).json({
      error: "Not Found",
    });
  }
};

const totalValue = async (req,res) => {
  try {
    await Player.aggregate([
      {
        $match: {team: req.team._id}
      },
      {
        $group: {
          _id: null,
          sumValue: {
            $sum: "$value",
          },
        },
      },
      { $unset: ["_id"] },
    ], function(err, result) {
      if(err){
        console.log(err)
      }else{
        res.json(result[0])
      }})
  } catch (error) {
    return res.status(400).json({
      error: "Not Found",
    });
  }
}

export default {
  totalLikeUser,
  totalCommentLikes,
  totalLikeNews,
  totalFollowerSubscribe,
  totalValue
};
