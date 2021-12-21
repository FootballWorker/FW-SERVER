import extend from "lodash/extend.js";

import Team from "./../models/team.model.js";
import User from "./../models/user.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import {fireResign,fireResignPerson,rejectPerson,hirePerson,hirePeople, appointPerson} from './../helpers/hireFireResign.js'
import {making,unMaking,unWithoutLength,withoutLength} from './../helpers/starSubscribe.js'


// ----------------------------------------- CRUD --------------------------------------------

const create = async (req,res,next) => {
  let team = new Team(req.body)
  try {
    let result = await team.save()
    res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const teamByID = async (req,res,next,id) => {
  try {
    let team = await Team.findById(id)
      .populate("president", "_id name")
      .populate("vicePresident", "_id name")
      .populate("manager", "_id name")
      .populate("coach", "_id name")
      .populate("scout", "_id name")
      .populate("youth", "_id name")
      .populate("stars", "_id name")
      .populate("members", "_id name")
      .populate("application", "_id name followerLength")
      .populate("candidates", "_id name photo followerLength")
      .exec();

    if (!team)
      return res.status('400').json({
        error: "Team not found"
      })
    req.team = team
    next()
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve team",
    });
  }
}

const list = async (req, res) => {
  try {
    let teams = await Team.find().sort('-name').exec()
    res.json(teams);
  } catch (error) {
    return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
  }
};

const read = (req, res) => {
  return res.json(req.team);
};

const update = async (req, res) => {
  let team = req.team;
  team = extend(team, req.body);
  team.updated = Date.now();
  try {
    await team.save();
    res.json(team);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const remove = async (req, res, next) => {
  try {
    let team = req.team;
    let deletedTeam = await team.remove();
    res.json(deletedTeam);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};




const listByStar = async (req,res) => {
  try {
    let teams = await Team.find({starLength : {$gte: 500}}).limit(8).exec()
    res.json(teams)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listCountries = async (req,res) => {
  try {
    let countries = await Team.distinct('country',{})
    res.json(countries)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

// Search List
const listForSearch = async (req,res) => {
  const query = {}
  if(req.query.search){
    query.name = { $regex: req.query.search, $options: "i" };
  }
  if(req.query.country && req.query.country !== 'ALL'){
    query.country = { $regex: req.query.country, $options: "i" };
  }
  try {
    let teams = await Team.find(query)
    res.json(teams)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByLiked = async (req,res) => {
  try {
    let teams = await Team.find({stars: { $elemMatch: { $eq: req.auth._id } }}).select("_id name starLength").exec()
    res.json(teams)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}



// -------------------------------- HIRING AND FIRING SYSTEM -------------------------------


// -------------------------------------- HIRE PEOPLE ---------------------------------------

const makePresident = (req,res,next) => {
  hirePerson(Team, req.body.teamId, "president",req.body.userId , res,next)
}

const appointedAsPresident = (req,res) => {
  appointPerson(User, req.body.userId,"team",req.body.teamId,res) 
}

const makeVicePresident = (req,res,next) => {
  hirePeople(Team,req.body.teamId,"vicePresident","vicePresidentLength",req.body.userId,res,next) 

}

const appointedAsVicePresident = (req, res) => {
  appointPerson(User, req.body.userId,"team", req.body.teamId,res) 
};

const makeManager = (req, res, next) => {
  hirePerson(Team, req.body.teamId, "manager",req.body.userId , res,next)
};

const appointedAsManager = (req, res) => {
  appointPerson(User, req.body.userId,"team", req.body.teamId,res) 
};

const makeCoach = (req, res, next) => {
  hirePeople(Team,req.body.teamId,"coach","coachLength",req.body.userId,res,next) 
};

const appointedAsCoach = (req, res) => {
  appointPerson(User, req.body.userId,"team", req.body.teamId,res) 
};

const makeYouth = (req, res, next) => {
  hirePeople(Team,req.body.teamId,"youth","youthLength",req.body.userId,res,next)
};

const appointedAsYouth = (req, res) => {
  appointPerson(User, req.body.userId,"team", req.body.teamId,res) 
};

const makeScout = (req, res, next) => {
  hirePeople(Team,req.body.teamId,"scout","scoutLength",req.body.userId,res,next)
};

const appointedAsScout = (req, res) => {
  appointPerson(User, req.body.userId,"team", req.body.teamId,res) 
};



// ----------------------------------- FIRE PEOPLE ----------------------------------------

const firePresident = (req, res, next) => {
  fireResignPerson(Team,req.body.teamId,"president",res,next)
};

const rejectedAsPresident = (req, res) => {
  rejectPerson(User,req.body.userId,"team",res) 

};

const fireVicePresident = (req, res, next) => {
  fireResign(Team,"vicePresident","vicePresidentLength",req.body.userId,req.body.teamId,res,next)
};

const rejectedAsVicePresident = (req, res) => {
  rejectPerson(User,req.body.userId,"team",res) 
};

const fireManager = (req, res, next) => {
  fireResignPerson(Team,req.body.teamId,"manager",res,next)
};

const rejectedAsManager = (req, res) => {
  rejectPerson(User,req.body.userId,"team",res) 
};

const fireCoach = (req, res, next) => {
  fireResign(Team,"coach","coachLength",req.body.userId,req.body.teamId,res,next)
};

const rejectedAsCoach = (req, res) => {
  rejectPerson(User,req.body.userId,"team",res) 
};

const fireYouth = (req, res, next) => {
  fireResign(Team,"youth","youthLength",req.body.userId,req.body.teamId,res,next)
};

const rejectedAsYouth = (req, res) => {
  rejectPerson(User,req.body.userId,"team",res) 
};

const fireScout = (req, res, next) => {
  fireResign(Team,"scout","scoutLength",req.body.userId,req.body.teamId,res,next)
};

const rejectedAsScout = (req, res) => {
  rejectPerson(User,req.body.userId,"team",res) 
};

// ------------------------- END OF THE HIRING AND FIRING SYSTEM ------------------------------------



//  ------------------------------- STARS SYSTEM ---------------------------------------------

const star = (req, res) => {
  making(Team,req.body.teamId,"stars","starLength",req.body.userId,res)
};

const unstar = (req, res) => {
  unMaking(Team,req.body.teamId,"stars","starLength",req.body.userId,res)
};




// Applications

const apply = (req,res) => {
  withoutLength(Team,req.body.teamId,"application",req.body.userId,res)
}

const cancelApply = (req,res) => {
  unWithoutLength(Team,req.body.teamId,"application",req.body.userId,res)
}

// Candidate

const runForElection = (req,res) => {
  withoutLength(Team,req.body.teamId,"candidates",req.body.userId,res)
}

const cancelCandidate = (req,res) => {
  unWithoutLength(Team,req.body.teamId,"candidates",req.body.userId,res)
}



// Permissions

const isCandidate = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    const userTeam = await Team.findById(req.body.teamId).populate("candidates","_id name").exec();
  
    const checkCandidates = (team) => {
      const match = team.candidates.some((candidate) => {
         return candidate._id == user._id;
      });
      return match;
   };  

   const checking = checkCandidates(userTeam)

   if (user.team) {
     return res.status(403).json({
       error: "This person has already a job!",
     });
   }


   if (!checking) {
     return res.status(403).json({
       error: "User not applied for job!",
     });
   }
  
   next();
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong!"
    })
  }
  
};

const isEmployee = async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  const team = await Team.findById(req.body.teamId)
  if (team.application.filter((employee) => employee._id.toString() === user._id).length <= 0){
    return res.status(403).json({
      error : "User not applied for job!"
    })
  }
  if (user.team) {
    return res.status(403).json({
      error: "This person has already a job!",
    });
  }
  next()
};

const isUnemployee = async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  if (!user.team) {
    return res.status(400).json({
      error: "This person has not a job!"
    });
  }
  next()
};

const isPresident = async (req,res,next) => {
  const user = await User.findById(req.auth._id).populate('job','_id title').exec()
  if(user.job.title !== 'president' ){
    return res.status(400).json({
      error: "Your job must be President to carry out this operation."
    })
  }
  if(user.favoriteTeam._id != req.body.teamId ){
    return res.status(400).json({
      error: "You must be member of this team!."
    })
  }
  next()
}


// Increment Views

const incrementViews = async (req,res,next) => {
  try {
    await Team.findByIdAndUpdate(
      req.team._id,
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




export default {
  create,
  teamByID,
  list,
  read,
  update,
  remove,
  listByStar,
  listCountries,
  listForSearch,
  listByLiked,
  makePresident,
  appointedAsPresident,
  makeVicePresident,
  appointedAsVicePresident,
  makeManager,
  appointedAsManager,
  makeCoach,
  appointedAsCoach,
  makeYouth,
  appointedAsYouth,
  makeScout,
  appointedAsScout,
  firePresident,
  rejectedAsPresident,
  fireVicePresident,
  rejectedAsVicePresident,
  fireManager,
  rejectedAsManager,
  fireCoach,
  rejectedAsCoach,
  fireYouth,
  rejectedAsYouth,
  fireScout,
  rejectedAsScout,
  star,
  unstar,
  apply,
  cancelApply,
  runForElection,
  cancelCandidate,
  isCandidate,
  isEmployee,
  isUnemployee,
  isPresident,
  incrementViews,
};
