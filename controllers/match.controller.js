import mongoose from "mongoose";
import extend from "lodash/extend.js";

import User from "../models/user.model.js";
import Match from "./../models/match.model.js";
import Team from "./../models/team.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";

const create = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const home = await Team.findById(user.team)
      .populate("manager")
      .populate("coach")
      .exec();
    const away = await Team.findById(req.team._id)
      .populate("manager")
      .populate("coach")
      .exec();
    let coaches = [];
    if (home.coach) {
      coaches = home.coach;
    }

    if (away.coach) {
      coaches.push(...away.coach);
    }

    let match = new Match(req.body);

    match.createdBy = user._id;
    match.home = home._id;
    match.away = req.team._id;
    match.country = home.country;
    if (home.manager) {
      match.audiences.push(home.manager);
    }
    if (away.manager) {
      match.audiences.push(away.manager);
    }
    match.audiences.push(...coaches);

    let result = await match.save();
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const matchByID = async (req, res, next, id) => {
  try {
    const match = await Match.findById(id)
      .populate("createdBy", "_id name")
      .populate("home", "_id name starLength stadium stadiumCapacity")
      .populate("away", "_id name starLength")
      .populate("audiences", "_id name")
      .exec();
    if (!match) {
      return res.status(400).json({
        error: "Match could not be found",
      });
    }
    req.match = match;
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const read = (req, res) => {
  return res.json(req.match);
};

const list = async (req, res) => {
  try {
    const matches = await Match.find().sort("-date").exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listByTeam = async (req, res) => {
  try {
    let matches = await Match.find({
      $or: [{ home: req.team._id }, { away: req.team._id }],
    })
      .populate("home", "_id name")
      .populate("away", "_id name")
      .exec();

    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const latestMatches = async (req, res) => {
  try {
    let matches = await Match.find({
      $or: [{ home: req.team._id }, { away: req.team._id }],
    })
      .sort("date")
      .limit(5)
      .exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listForHome = async (req, res) => {
  const week = Date.now() - 1000 * 60 * 60 * 24 * 7;
  try {
    let user = await User.findById(req.auth._id);
    let matches = await Match.find({
      country: user.country,
      date: { $gt: week },
      views: { $gte: 100 },
    })
      .sort("date")
      .limit(5)
      .exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const topTeam = async (req, res) => {
  try {
    let matches = await Match.find({
      $or: [{ home: req.team._id }, { away: req.team._id }],
    })
      .sort("-views")
      .limit(10)
      .exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listByAudience = async (req, res) => {
  const week = Date.now() - 1000 * 60 * 60 * 24 * 7;
  try {
    let matches = await Match.find({ views: { $gte: 200 }, date: { $gt: week } })
      .sort("-date")
      .limit(10)
      .exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listForSearch = async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.lastDay && req.query.firstDay) {
    query.date = {
      $gte: req.query.firstDay,
      $lt: req.query.lastDay,
    };
  }
  try {
    let matches = await Match.find(query)
      .populate("home", "_id name")
      .populate("away", "_id name")
      .exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const searchMatchByTeam = async (req, res) => {
  const query = {};
  if (req.query.teamId) {
    query.team = req.query.teamId;
  } else {
    return res.status(400).json({
      error: "No Team Found!",
    });
  }

  if (req.query.season) {
    query.season = req.query.season;
  }

  if (req.query.section && req.query.section !== "All") {
    query.section = req.query.section;
  }

  try {
    let matches = await Match.find({
      $or: [{ home: query.team }, { away: query.team }],
      season: query.season,
      section: query.section,
    })
      .populate("home", "_id name")
      .populate("away", "_id name")
      .exec();
    res.json(matches);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const update = async (req, res) => {
  let match = req.match;
  match = extend(match, req.body);
  match.updated = Date.now();
  try {
    await match.save();
    res.json(match);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const remove = async (req, res, next) => {
  try {
    let match = req.match;
    let deletedMatch = await match.remove();
    res.json(deletedMatch);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// PREDICTION

const predictHome = async (req, res) => {
  try {
    let result = await Match.findByIdAndUpdate(
      req.body.matchId,
      {
        $inc: { "probability.homePercent": 1 },
        $push: { "probability.users": req.auth._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const predictDraw = async (req, res) => {
  try {
    let result = await Match.findByIdAndUpdate(
      req.body.matchId,
      {
        $inc: { "probability.drawPercent": 1 },
        $push: { "probability.users": req.auth._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const predictAway = async (req, res) => {
  try {
    let result = await Match.findByIdAndUpdate(
      req.body.matchId,
      {
        $inc: { "probability.awayPercent": 1 },
        $push: { "probability.users": req.auth._id },
      },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const audience = async (req, res) => {
  try {
    let result = await Match.findByIdAndUpdate(
      req.body.matchId,
      { $push: { audiences: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const disaudience = async (req, res) => {
  try {
    let result = await Match.findByIdAndUpdate(
      req.body.matchId,
      { $pull: { audiences: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Permissions

const isAppropriate = async (req, res, next) => {
  try {
    const date = new Date.now();
    let match = await Match.findById(req.body.matchId)
      .populate("home", "_id")
      .exec();
    let team = await Team.findById(match.home);
    if (date > match.date) {
      return res.status(403).json({
        error: "You could not be audience after the match!",
      });
    }
    if (match.audienceLength >= team.stadiumCapacity) {
      return res.status(403).json({
        error: "Stadium Capacity Is Full!",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const isVicePresident = async (req, res, next) => {
  try {
    let user = await User.findById(req.auth._id)
      .populate("team", "_id name")
      .populate("job", "_id name")
      .exec();
    if (!user) {
      return res.status(403).json({
        error: "Credentials needed!",
      });
    }

    if (!user.team) {
      return res.status(403).json({
        error: "You must be worker of any team!",
      });
    }

    if (user.job?.title !== "vicepresident") {
      return res.status(403).json({
        error: "You must be Vice President to proclaim a match!",
      });
    }

    if (user.team?._id === req.team._id) {
      return res.status(403).json({
        error: "You cannot play against yourself!",
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Increment Views

const incrementViews = async (req, res, next) => {
  try {
    await Match.findByIdAndUpdate(
      req.match._id,
      { $inc: { views: 1 } },
      { new: true }
    ).exec();
    next();
  } catch (error) {
    return res.status(400).error({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

export default {
  create,
  matchByID,
  read,
  list,
  latestMatches,
  listForHome,
  listByTeam,
  listByAudience,
  topTeam,
  listForSearch,
  searchMatchByTeam,
  update,
  remove,
  predictHome,
  predictDraw,
  predictAway,
  audience,
  disaudience,
  isAppropriate,
  isVicePresident,
  incrementViews,
};
