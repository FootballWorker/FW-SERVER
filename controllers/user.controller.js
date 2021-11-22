import extend from "lodash/extend.js";
import formidable from "formidable";
import fs from "fs";
import jwt from 'jsonwebtoken'

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Team from "../models/team.model.js";
import News from "../models/news.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import config from "./../config/config.js";
import sendMail from "./../helpers/sendMail.js";

// -----------AUTHENTICATE----------------

// Create user / Sign Up
const create = async (req, res) => {
  try {
    let validEmail = await User.findOne({ email: req.body.email });
    if (validEmail) {
      return res.status(400).json({
        error: "This email is already used!",
      });
    }
    let validUsername = await User.findOne({ name: req.body.name });
    if (validUsername) {
      return res.status(400).json({
        error: "This username is already taken!",
      });
    }

    const activation_token = jwt.sign(req.body, process.env.ACTIVATION_TOKEN, {expiresIn: '5m'})

    const url = `${process.env.CLIENTURI}/activate/${activation_token}`

    await sendMail(req.body.email, url, "Verify your email address",`Hello ${req.body.name} ! We are so happy and honored to see you among us! Activate your email and become FW officially right now! `,'Activate Account')
    res.json({message: "Registered successfully! Please activate your email to start."})


    // if (req.body.favoriteTeam) {
    //   let team = await Team.findById(req.body.favoriteTeam);
    //   team.members.push(user._id);
    //   await team.save();
    // }

    // let ntf = await Notification.create({
    //   title: "Welcome to FW",
    //   text: "Congratulations. You are officially an FW right now! You can work for any team or any newspaper you like, if you are good at commenting on football, of course! We hope that this website helps you to make your dreams in the football realm. We believe, the format of this website uncovers some great football commentators who are love to support their teams or just love football and talk about it and hopefully help them to find a job in that area. As for departments and jobs, it does not matter what you write about, you are completely free for choosing any topic but writing about subjects that belong to your job title helps you get a position in teams or news. Lastly, we would like you to know that this website is kind of slow and some functions like notifications and votes do not work synchronously and you can see some lack of security in login page because of technical and financial deficiency in our firm but we will improve as this website gets popular. Eventually, we recommend you to use a PC other than another device for now. Good luck!",
    //   from: "Football Worker",
    //   forWho: user._id,
    // });

    // user.notifications.push(ntf);

    // await user.save();
    // return res.status(200).json({
    //   message: "Succesfully signed up!",
    // });
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Activate Email
const activation = async (req, res) => {
  try {
      const user = jwt.verify(req.params.activationToken, process.env.ACTIVATION_TOKEN)
      if(!user){
        return res.status(400).json({
          error: "Your activation time has ended!"
        })
      }
      const newUser = new User(user)
      let ntf = await Notification.create({
        title: "Welcome to FW",
        text: "Congratulations. You are officially an FW right now! You can work for any team or any newspaper you like, if you are good at commenting on football, of course! We hope that this website helps you to make your dreams in the football realm. We believe, the format of this website uncovers some great football commentators who are love to support their teams or just love football.  Hopefully, this website and our other jobs in the future help them to find a job in this area. As for departments and jobs, it does not matter what you write about, you are completely free for choosing any topic but writing about subjects that belong to your job title helps you get a position in teams or news. Lastly, we would like you to know that this website is kind of slow and some functions like notifications and votes do not work synchronously and you can meet some tawdriness in design because of technical and financial deficiency in our firm but we promise that we will improve as this website gets popular. Eventually, we recommend you to use a PC other than another device for now because some functions do not appear on mobile platforms. Good luck!",
        from: "Football Worker",
        forWho: newUser._id,
      });

      newUser.notifications.push(ntf);


      const {favoriteTeam} = user
      const newUser = new User(user)

      let team = await Team.findById(favoriteTeam)

      team.members.push(newUser._id)

      await newUser.save()
      await team.save()

      res.json({message: "Account has been activated!"})

  } catch (err) {
      return res.status(500).json({error: "Something went wrong! Most likely its because your activation time has ended but this would be a cyber attack or there could be some errors in our servers! Please try again. If you could not make it, just contact us."})
  }
}


// Getting id
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("favoriteTeam", "_id name")
      .populate("team", "_id name")
      .populate("news", "_id title")
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};

// Read Profile / Profile Page
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// List Users
const list = async (req, res) => {
  try {
    let users = await User.find().sort("-starLength").exec();
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Search For Users
const searchUsers = async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.job && req.query.job != "All") {
    query.job = req.query.job;
  }
  try {
    let users = await User.find(query)
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("favoriteTeam", "_id name")
      .exec();
    res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Update User
const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (error) {
      return res
        .status(400)
        .json({ error: errorHandler.getErrorMessage(error) });
    }
  });
};

const changeFavorite = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.userId,
      { favoriteTeam: req.body.favoriteTeam },
      { new: true }
    )
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("favoriteTeam", "_id name")
      .populate("team", "_id name")
      .populate("news", "_id title")
      .exec();

    if (req.body.favoriteTeam) {
      let team = await Team.findById(req.body.favoriteTeam);
      team.members.push(result._id);
      await team.save();
    }

    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Delete User
const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

// Find Applicants

const applicants = async (req, res) => {
  let users = req.team.application;
  try {
    let applicants = await User.find({ _id: { $in: users } })
      .select("_id name followerLength photo")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("team", "_id name")
      .exec();
    res.json(applicants);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const newsApplicants = async (req, res) => {
  let users = req.news.applications;
  try {
    let applicants = await User.find({ _id: { $in: users } })
      .select("_id name followerLength photo")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("news", "_id title")
      .exec();
    res.json(applicants);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// ------------FOLLOWING SYSTEM BACKEND------------

// Add Following Conroller
const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { following: req.body.followId } },
      { new: true }
    );

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Add Followers Controller
const addFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId }, $inc: { followerLength: 1 } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Remove Following Conroller
const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $pull: { following: req.body.unfollowId } },
      { new: true }
    );

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Remove Follower Controller
const removeFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId }, $inc: { followerLength: -1 } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const followerLength = async (req, res) => {
  let users = req.profile && req.profile.followers;
  try {
    let follows = await User.find({ _id: { $in: users } }).select(
      "_id name photo"
    );
    res.json(follows);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const followingsLength = async (req, res) => {
  let users = req.profile && req.profile.following;
  try {
    let follows = await User.find({ _id: { $in: users } }).select(
      "_id name photo"
    );
    res.json(follows);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// -------------- Increment Views -----------------

const incrementViews = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.profile._id,
      { $inc: { views: 1 } },
      { new: true }
    ).exec();

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// ------------------------- NOTIFICATION SYSTEM ----------------------------

const ntfFromSite = async (req, res) => {
  let ntf = new Notification(req.body);
  try {
    ntf.from = "Football Worker";
    ntf.forWho = req.profile._id;
    let result = await ntf.save();
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const notificationByID = async (req, res, next, id) => {
  try {
    let notification = await Notification.findById(id)
      .populate("forWho", "_id name")
      .exec();
    if (!notification)
      return res.status("400").json({
        error: "User not found",
      });
    req.notification = notification;
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const readNotification = async (req, res) => {
  return res.status(200).json(req.notification);
};

const notificationList = async (req, res, next) => {
  try {
    let ntfs = await Notification.find({ forWho: req.profile._id })
      .sort("-created")
      .populate("forWho", "_id name")
      .exec();

    res.json(ntfs);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const changeStatus = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(
      req.notification._id,
      { status: true },
      { new: true }
    );
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const unReadList = async (req, res) => {
  try {
    let ntfs = await Notification.find({ forWho: req.auth._id, status: false });
    res.json(ntfs);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const removeNtf = async (req, res) => {
  try {
    let ntf = req.notification;
    let deletedNtf = await ntf.remove();
    res.json(deletedNtf);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    let result = await Notification.deleteMany({ forWho: req.auth._id });
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

export default {
  create,
  activation,
  userByID,
  list,
  searchUsers,
  read,
  update,
  changeFavorite,
  remove,
  photo,
  applicants,
  newsApplicants,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  followerLength,
  followingsLength,
  incrementViews,
  ntfFromSite,
  notificationList,
  changeStatus,
  notificationByID,
  readNotification,
  unReadList,
  removeNtf,
  removeAll,
};
