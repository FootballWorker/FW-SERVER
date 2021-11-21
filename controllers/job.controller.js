import extend from "lodash/extend.js";

import Job from "./../models/job.model.js";
import Department from "./../models/department.model.js";
import Team from "./../models/team.model.js";
import User from "./../models/user.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";


const create = async (req,res) => {
  try {
    const {title} = req.body

    // Check if department exists!
    const checkDepartment = await Department.findById(req.department._id)
    if (!checkDepartment) {
      return res.status(400).json({
        error: 'Department is not found!'
      })
    }
    let job = new Job({
      title
    })
    job.department = req.department
    let result = await job.save()
    return res.json(result)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
}

const jobByID = async (req,res,next,id) => {
  try {
    const job = await Job.findById(id).populate("department","_id name").exec()
    if (!job) {
      return res.status(400).json({
        error: "Job not found!",
      });
    }

    req.job = job;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve team",
    });
  }
}

const list = async (req,res) => {
  try {
    let jobs = await Job.find()
    res.json(jobs)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByDepartment = async (req, res) => {
  try {
    let jobs = await Job
      .find({ department: req.department._id })
      .populate(
      "department",
      "_id name"
      )
      .exec()

    res.json(jobs);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const listVacantJobs = async (req,res) => {
  const empty = []
  if(req.job){
    if (req.job.title === "president") {
      try {
        let teams = await Team.find({ president: {$exists: false},starLength: {$gte : 50} })
          .limit(10)
          .exec();
        res.json(teams);
      } catch (error) {
        return res.status(400).json({
          error: "No team found!",
        });
      }
    } else if (req.job.title === "vice president") {
      try {
        let teams = await Team.find({ vicePresidentLength: { $lt: 5 },starLength: {$gte : 50} })
          .limit(10)
          .exec();
        res.json(teams);
      } catch (error) {
        return res.status(400).json({
          error: "No team found!",
        });
      }
    } else if (req.job.title === "manager") {
      try {
        let teams = await Team.find({ manager: {$exists: false} ,starLength: {$gte : 50}})
          .limit(10)
          .exec();
        res.json(teams);
      } catch (error) {
        return res.status(400).json({
          error: "No team found!",
        });
      }
    } else if (req.job.title === "coach") {
      try {
        let teams = await Team.find({ coachLength: { $lt: 5 },starLength: {$gte : 50} })
          .limit(10)
          .exec();
        res.json(teams);
      } catch (error) {
        return res.status(400).json({
          error: "No team found!",
        });
      }
    } else if (req.job.title === "scout") {
      try {
        let teams = await Team.find({ scoutLength: { $lt: 5 },starLength: {$gte : 50} })
          .limit(10)
          .exec();
        res.json(teams);
      } catch (error) {
        return res.status(400).json({
          error: "No team found!",
        });
      }
    } else if (req.job.title === "youth") {
      try {
        let teams = await Team.find({ youthLength: { $lt: 5 } ,starLength: {$gte : 50}})
          .limit(10)
          .exec();
        res.json(teams);
      } catch (error) {
        return res.status(400).json({
          error: "No team found!",
        });
      }
    } else {
      return empty;
    }
  }else{
    return res.status(400).json({
      error: "No Job Found"
    })
  }
}

const bestWorkers = async (req,res) => {
  try {
    let workers = await User.find({ job: req.job._id }).populate('team','_id name').sort("-followerLength").limit(15).exec()
    res.json(workers)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const read = (req, res) => {
  return res.json(req.job);
};

const update = async (req, res) => {
  try {
    let job = await Job.updateOne(
      {_id:req.job._id},
      {title:req.body.title,updated:Date.now},
      { new: true }
    );

    res.json(job);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const remove = async (req, res, next) => {
  try {
    let job = req.job;
    let deletedJob = await job.remove();
    res.json(deletedJob);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};


export default {
  create,
  jobByID,
  list,
  listByDepartment,
  listVacantJobs,
  bestWorkers,
  read,
  update,
  remove,
};
