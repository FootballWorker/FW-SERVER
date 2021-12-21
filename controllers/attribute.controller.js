import mongoose from 'mongoose'

import Attribute from './../models/attribute.model.js'
import Team from './../models/team.model.js'
import User from './../models/user.model.js'
import errorHandler from "./../helpers/dbErrorHandler.js";



// ------------------------ CATEGORY controllers ---------------------------------



// ------------------------- ATTRIBUTE controllers ------------------------------------


const create = async (req,res) => {
  try {
    // Check if user pointed already
    let isPointed = await Attribute.findOne({recordedBy: req.auth._id , category: req.body.category,player:req.player._id})
    if(isPointed){
      return res.status("400").json({
        error: "Hey You already gave points for this category! However, you can edit it."
      })
    }
    const attribute = new Attribute(req.body)

    attribute.recordedBy = req.auth._id
    attribute.player = req.player._id
    await attribute.save()
    return res.status(200).json({
      message: "Your assessment is saved"
    })
  } catch (error) {
    return res.status(400).json({
      error : errorHandler.getErrorMessage(error)
    })
  }
}

const attributeByID = async (req, res, next, id) => {
  try {
    let attribute = await Attribute.findById(id)
      .populate("recordedBy", "_id name")
      .populate("player", "_id name")
      .exec();
    if (!attribute) {
      return res.status(400).json({
        error: "Could not retrieve attribute",
      });
    }
    req.attribute = attribute;
    next();
  } catch (error) {
    return res.status(500).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const read = (req,res) => {
  res.json(req.attribute)
}

const averageAttributes = async (req,res) => {
  try {
    let averageAttr = await Attribute.aggregate([
      { $match: { player: mongoose.Types.ObjectId(req.player._id) } },
      { $group: {_id : "$category", averagePoint: {$avg: "$point"} }},
      { $project : { x: "$_id", y: "$averagePoint" } },
    ]).exec();
    res.json({
      avgAtt: averageAttr
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const list = async (req,res) => {
  try {
    let attributes = await Attribute.find({player:req.player._id}).populate("recordedBy","_id name").populate("player","_id name").exec()
    res.json(attributes)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

const listByUser = async (req,res) => {
  try {
    let users = await Attribute.find({player:req.player._id,recordedBy:req.auth._id }).populate("recordedBy","_id name").exec()
    res.status(200).json(users)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

const update = async (req,res) => {
  try {
    let result = await Attribute.findByIdAndUpdate(
      req.body.attributeId,
      {point : req.body.point},
      {new: true}
    ).populate("recordedBy","_id name").populate("player","_id name").exec()
    res.json(result)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

const remove = async (req,res) => {
  let attribute = req.attribute;
  try {
    let deletedAttribute = await attribute.remove();
    res.json(deletedAttribute);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

const isTechnic = async (req, res, next) => {
  try {
    let user = await User.findById(req.auth?._id).populate('team','_id name').exec()

    if(!user.team){
      return res.status(403).json({
        error: "You work at none!"
      })
    }

    if(user?.team?._id == req.player?.team?._id) {
      return res.status(403).json({
        error: "You must be Worker at team that this player is belongs to",
      });
    }

    next();
  } catch (error) {
    console.log(error)
  }
};

const isRecorded = async (req,res,next) => {
  const authorized = req.body?.recordedBy === req.auth?._id
  if (!(authorized)) {    
    return res.status('403').json({      
      error: "User is not authorized!"    
    })}  

  next()
}







export default {
  create,
  attributeByID,
  read,
  averageAttributes,
  list,
  listByUser,
  update,
  remove,
  isTechnic,
  isRecorded
}