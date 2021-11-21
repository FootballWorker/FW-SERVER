import formidable from "formidable";

import Poll from "./../models/poll.model.js";
import User from "./../models/user.model.js";
import Team from "./../models/team.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import config from "./../config/config.js";





const create = async (req,res,next) => {
  const {_id} = req.team 
  const { title , pollStart , pollEnd } = req.body
  try {
    const team = await Team.findById(_id).populate('candidates').exec()
    const options = team.candidates
    const poll = new Poll({
      title,
      options: options.map(option => ({option,votes:0})),
      pollStart,
      pollEnd,
    })
    team.polls.push(poll._id)
    poll.creator = req.auth._id
    poll.team = req.team._id
    await team.save()
    await poll.save()

    return res.status(201).json({
      ...poll._doc,
      team: team._id
    })
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }

}

const pollByID = async (req, res, next, id) => {
  try {
    let poll = await Poll.findById(id)
      .populate("creator", "_id name")
      .populate("team","_id name firstColor secondColor")
      .populate("options.option","_id name photo followerLength")
      .populate("voted","_id name")
      .exec();

    if (!poll)
      return res.status("400").json({
        error: "Poll not found",
      });
    req.poll = poll;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve auction",
    });
  }
};

const listByTeam = async (req,res) => {
  try {
    let polls = await Poll.find({ team: req.team._id })
      .sort("-created")
      .populate("team", "_id name")
      .exec();
    res.json(polls)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listOpen = async (req,res) => {
  try {
    let polls = await Poll.find({
      pollEnd: {
        $gte : new Date()
      }
    }).populate('team','_id title').sort('-created').limit(10).exec()

    res.json(polls)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const read = (req,res) => {
  return res.json(req.poll)
} 

const vote = async (req,res,next) => {

  try{
    if(req.body.userId){
      const poll = await Poll.findById(req.body.pollId);
      if (!poll) throw new Error("No poll found");

      const vote = poll.options.map((option) =>
        option.option == req.body.userId
          ? {
              option: option.option,
	            _id: option._id,
              votes: option.votes + 1,
            }
          : option
      );

      
      poll.voted.push(req.auth._id);
      poll.options = vote;

      await poll.save();

      return res.status(200).json(poll);
    }else {
      return res.status(400).json({
        error: "Candidate has not been found!"
      })
    }

  }catch(error){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
}

const remove = async (req, res) => {
  try {
    let poll = req.poll;
    let deletedPoll = poll.remove();
    res.json(deletedPoll);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Change it
const isMember = async (req,res,next) => {
  try {
    const user = await User.findById(req.auth._id).populate("favoriteTeam","_id name").exec()
    const poll = await Poll.findById(req.body.pollId).populate("team","_id name").exec()
    const isMatch = user.favoriteTeam && poll.team && user.favoriteTeam.name === poll.team.name 

    if(!isMatch){
      return res.status(403).json({
        error: "You must be member of this team!"
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong!"
    })
  }
}


// Change it to admin
const isCreator = (req,res,next) => {
  let isCreator = req.auth && req.poll && req.auth._id == req.poll.creator._id
  if(!(isCreator)){
    return res.status(400).json({
      error: "You should be creator to remove this poll!"
    })
  }
  next()
}



export default {
  create,
  pollByID,
  listByTeam,
  listOpen,
  vote,
  read,
  remove,
  isMember,
  isCreator,
};