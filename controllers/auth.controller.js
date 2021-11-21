import jwt from "jsonwebtoken";
import extend from "lodash/extend.js";
import expressJwt from "express-jwt";
import formidable from "formidable";

import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import config from "./../config/config.js";
import receiveMail from "./../helpers/receiveMail.js";
import sendMail from "./../helpers/sendMail.js";
import errorHandler from "./../helpers/dbErrorHandler.js";

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("favoriteTeam", "_id name")
      .populate("team", "_id name")
      .populate("news", "_id title")
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();

    if (!user) {
      return res.status("401").json({ error: "User not found" });
    }
    if (!user.authenticate(req.body.password)) {
      return res
        .status("401")
        .send({ error: "Email and password don't match." });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("t", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        job: user.job,
        favoriteTeam: user.favoriteTeam,
        team: user.team,
        news: user.news,
      },
    });
  } catch (error) {
    return res.status("401").json({ error: "Could not sign in" });
  }
};

const contact = async (req, res) => {
  try {
    const txt = `
    <div>
      <h4> team</h4>
      <p> ${req.body.team} </p>
    </div>
    <div>
      <h4> player</h4>
      <p> ${req.body.player} </p>
    </div>
    <div>
      <h4> position</h4>
      <p> ${req.body.position} </p>
    </div>
    <div>
      <h4> text</h4>
      <p> ${req.body.text} </p>
    </div>`;

    let result = await receiveMail(txt);
    res.json({
      message: "Congratulations! Your recommendations are sent to us.",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Could not send!",
    });
  }
};

const presidentMail = async (req, res) => {
  try {
    const txt = `
      <h2 style={{textAlign:'center'}} > Poll Request </h2>
      <div>
        <h4> Team</h4>
        <p> ${req.body.team} </p>
      </div>
      <div>
        <h4> User</h4>
        <p> ${req.body.user} </p>
      </div>
      <div>
        <h4> Message</h4>
        <p> Received poll request!  </p>
      </div>
     `;

    let result = await receiveMail(txt);
    res.json({
      message: "Thank you! Your request are sent to us.",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Could not send!",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        error: "User not found!",
      });
    }
    const resetToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const url = `${process.env.CLIENTURI}/reset/password/${resetToken}`;

    await sendMail(
      email,
      url,
      "Reset your password",
      `Hello ${user.name} ! It seems that you forgot your password! Do not worry, just click the button and change it! `,
      "Reset Password"
    );
    res.json({
      message: "Check your email!",
    });
  } catch (error) {
    return res.status(400).json({
      error: "A problem occured!We can not reach your email!",
    });
  }
};

const resetPassword = (req, res) => {
  let user = jwt.verify(req.params.resetToken, process.env.ACCESS_TOKEN_SECRET);
  if (!user) {
    return res.status(404).json({
      error: "Token",
    });
  }
  // const {password} = req.body
  // if(!password){
  //   return res.status(404).json({
  //     error: "Password not found!"
  //   })
  // }
  // if(password.length < 6){
  //   return res.status(404).json({
  //     error: "Password 6 must be!"
  //   })
  // }
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let newUser = await User.findById(user._id);
    newUser = extend(newUser, fields);
    newUser.updated = Date.now();

    try {
      await newUser.save();
      res.status(200).json({
        message: "Your password successfully changed!",
      });
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out",
  });
};

// Permissions


const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }

  next();
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (user.role !== "admin") {
      return res.status(500).json({
        error: "Access denied! Onyl admin accessing!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const isPresident = async (req, res, next) => {
  try {
    const team = await Team.findById(req.body.teamId)
      .populate("president", "_id name")
      .exec();

    if (!team) {
      return res.status(404).json({
        error: "No team Found!",
      });
    }

    if (req.auth._id != team.president._id) {
      return res.status(500).json({
        error: "Not Allowed! You must be President of this team first!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const isManager = async (req, res, next) => {
  try {
    const team = await Team.findById(req.body.teamId)
      .populate("manager", "_id name")
      .exec();

    if (!team) {
      return res.status(404).json({
        error: "No team Found!",
      });
    }

    if (req.auth._id != team.manager._id) {
      return res.status(500).json({
        error: "Not Allowed! You must be Manager of this team first!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const isEditor = async (req, res, next) => {
  try {
    let user = await User.findById(req.auth._id)
      .populate("news")
      .populate("department")
      .populate("job")
      .exec();
    if (user.department.name !== "JOURNAL") {
      return res.status(401).json({
        error: "Your Department is wrong to carry out this operation!",
      });
    }
    if (user.job.title !== "editor") {
      return res.status(401).json({
        error: "You must be Editor to found a new News!",
      });
    }
    if (user.news) {
      return res.status(401).json({
        error: "You are already work for a News!",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Functions

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default {
  signin,
  contact,
  presidentMail,
  forgotPassword,
  resetPassword,
  signout,
  requireSignin,
  hasAuthorization,
  isAdmin,
  isPresident,
  isManager,
  isEditor,
};
