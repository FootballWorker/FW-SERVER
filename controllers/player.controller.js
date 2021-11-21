import formidable from 'formidable'
import extend from 'lodash/extend.js'
import fs from 'fs'

import Position from "./../models/position.model.js";
import Player from "./../models/player.model.js";
import User from "./../models/user.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import {making, unMaking} from './../helpers/starSubscribe.js'




// ------------------------------------------- POSITION --------------------------------

const createPosition = async (req, res) => {
  try {
    let position = new Position(req.body);
    let result = await position.save();
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const positionByID = async (req,res,next,id) => {
  try {
    let position = await Position.findById(id);

    if (!position) {
      return res.status(400).json({
        error: "Position not found!",
      });
    }

    req.position = position;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve position",
    });
  }
} 

const listPositions = async (req,res) => {
  try {
    const positions = await Position.find()
    res.status(200).json(positions)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
}

const positionRead = (req, res) => {
  return res.json(req.position);
};

const positionUpdate = async (req, res, next) => {
  const { title } = req.body;
  let position = req.position;
  position = extend(position, title);
  position.updated = Date.now();
  try {
    await position.save();
    res.json(position);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const positionRemove = async (req, res, next) => {
  try {
    let position = req.position;
    let deletedPosition = await position.remove();
    res.json(deletedPosition);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};




// -------------------------------------------- PLAYER --------------------------------------

const create = async (req,res) => {
  let player = new Player(req.body);
  player.team = req.team._id
  try {
    await player.save();
    res.status(200).json(player);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
}

const playerByID = async (req, res, next, id) => {
  try {
    let player = await Player.findById(id).populate("team","_id name").populate("position","_id title").populate("stars","_id name").exec();

    if (!player) {
      return res.status(400).json({
        error: "Player not found!",
      });
    }

    req.player = player;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve player",
    });
  }
}; 

const read = (req, res) => {
  return res.json(req.player);
};

const photo = (req, res, next) => {
  if (req.player.photo.data) {
    res.set("Content-Type", req.player.photo.contentType);
    return res.send(req.player.photo.data);
  }
  next();
};


const list = async (req, res) => {
  try {
    let players = await Player
        .find()
        .sort('-created')
        .populate("team","_id name")
        .exec()
    res.json(players);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByTeam = async (req, res) => {
  try {
    let players = await Player.find({ team: req.team })
      .sort("-value")
      .populate("position", "_id title")
      .exec();
    res.json(players);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByPosition = async (req,res) => {
  try {
    let players = await Player.find({position: req.position}).populate("position","_id title").sort('-starLength').exec()
    res.json(players)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let player = req.player;
    player = extend(player, fields);
    player.updated = Date.now();

    if (files.photo) {
      player.photo.data = fs.readFileSync(files.photo.path);
      player.photo.contentType = files.photo.type;
    }

    
    try {
      await player.save();
      res.json(player);
    } catch (error) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
  });
};

const remove = async (req, res, next) => {
  try {
    let player = req.player;
    let deletedPlayer = await player.remove();

    res.json(deletedPlayer);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByStar = async (req, res) => {
  try {
    let players = await Player.find()
      .sort("-starLength")
      .limit(10)
      .populate("team","_id name")
      .populate("position","_id title")
      .exec();
    res.json(players);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};


// Search


const listForSearch = async (req,res) => {
  const query = {}
  if(req.query.search){
    query.name = {'$regex': req.query.search, '$options': 'i'}
  }
  if(req.query.position && req.query.position != 'All'){
    query.position = req.query.position
  }
  try {
    let players = await Player.find(query)
      .sort("-name")
      .populate("team", "_id name")
      .populate("position", "_id title")
      .exec();
    res.json(players)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

//  ------------------------------- STARS SYSTEM ---------------------------------------------

const star = (req, res) => {
  making(Player,req.body.playerId,"stars","starLength",req.body.userId,res)
};

const unstar = (req, res) => {
  unMaking(Player,req.body.playerId,"stars","starLength",req.body.userId,res)
};


// Increment Views

const incrementViews = async (req,res,next) => {
  try {
    await Player.findByIdAndUpdate(
      req.player._id,
      {$inc: {'views':1}},
      {new: true}
    ).exec()

    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


// Permissions

const isPresident = async (req,res,next) => {
  try {
    let user = await User.findById(req.auth?._id).populate('team','_id name').exec()

    if(!user.team){
      return res.status(403).json({
        error: "You work at none!"
      })
    }

    if(req.team){
      if(user.team._id == req.team?._id) {
        return res.status(403).json({
          error: "You must be President at team that this player is belongs to",
        });
      }
    }

    if(req.player){
      if(user.team._id == req.player.team?._id) {
        return res.status(403).json({
          error: "You must be President at team that this player is belongs to",
        });
      }
    }


    next();
  } catch (error) {
    console.log(error)
  }
}


export default {
  createPosition,
  positionByID,
  listPositions,
  positionRead,
  positionUpdate,
  positionRemove,
  create,
  playerByID,
  read,
  photo,
  list,
  listByTeam,
  listByPosition,
  listByStar,
  listForSearch,
  update,
  remove,
  star,
  unstar,
  incrementViews,
  isPresident
};