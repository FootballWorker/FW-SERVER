import extend from 'lodash/extend.js'
import formidable from 'formidable'
import fs from 'fs'

import Post from './../models/post.model.js'
import User from './../models/user.model.js'
import News from './../models/news.model.js'
import Team from './../models/team.model.js'
import errorHandler from './../helpers/dbErrorHandler.js'
import receiveMail from './../helpers/receiveMail.js'
import { making, unMaking } from '../helpers/starSubscribe.js'







// ---------------------------------- CREATE POSTS ------------------------------------

const createForTeam = async (req,res,next) => {
  try {
    const user = await User.findById(req.auth._id)
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Could not uploaded photos",
        });
      }
      let post = new Post(fields);

      post.department = user.department?._id;
      post.job = user.job?._id;
      post.team = req.team._id;
      post.postedBy = user._id;

      if (files.imageOne) {
        post.imageOne.data = fs.readFileSync(files.imageOne.path);
        post.imageOne.contentType = files.imageOne.type;
      }

      try {
        let result = await post.save();
        res.json(result);
      } catch (error) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const createForPlayer = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id)
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Could not uploaded photos",
        });
      }
      let post = new Post(fields);

      post.department = user.department._id;
      post.job = user.job._id;
      post.player = req.player._id;
      post.postedBy = user._id;

      if (files.imageOne) {
        post.imageOne.data = fs.readFileSync(files.imageOne.path);
        post.imageOne.contentType = files.imageOne.type;
      }

      try {
        let result = await post.save();
        res.json(result);
      } catch (error) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error : errorHandler.getErrorMessage(error)
    })
  }
};

const createForMatch = async (req,res,next) => {
  try {
    const user = await User.findById(req.auth._id)
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    
    let form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Could not uploaded photos",
        });
      }
      let post = new Post(fields);

      post.department = user.department._id;
      post.job = user.job._id;
      post.match = req.match._id;
      post.postedBy = user._id;

      if (files.imageOne) {
        post.imageOne.data = fs.readFileSync(files.imageOne.path);
        post.imageOne.contentType = files.imageOne.type;
      }

      try {
        let result = await post.save();
        res.json(result);
      } catch (error) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
    });
  } catch (error) {
    console.log(error.data);
  }
}

const createForNews = async (req,res) => {
  try {
    const user = await User.findById(req.auth._id)
      .populate("department","_id name")
      .populate("job","_id title")
      .exec();

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Images could not be uploaded!",
        });
      }

      let post = new Post(fields);
      post.department = user.department._id;
      post.job = user.job._id;
      post.news = req.news._id;
      post.postedBy = user._id;

      if (files.imageOne) {
        post.imageOne.data = fs.readFileSync(files.imageOne.path);
        post.imageOne.contentType = files.imageOne.type;
      }

      try {
        let result = await post.save()
        res.json(result)
      } catch (error) {
        return res.status(400).json({
          error : errorHandler.getErrorMessage(error)
        })
      }
    })
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


// Getting Post by ID

const postByID = async (req,res,next,id) => {
  try {
    let post = await Post
        .findById(id)
        .populate("postedBy", "_id name")
        .populate("department","_id name")
        .populate("job","_id title")
        .populate("team","_id name")
        .populate("player", "_id name")
        .populate("match", "_id title")
        .populate("news", "_id title")
        .populate("likes","_id name")
        .exec();
    if (!post)
      return res.status("400").json({
        error: "Post not found",
      });
    req.post = post;
    next();
  } catch (error) {
    return res.status("400").json({
      error: "Could not retrieve use post",
    });
  }
}

// ----------------------------- IMAGE ------------------------------------------

const imageOne = (req, res, next) => {
  res.set("Content-Type", req.post.imageOne.contentType);
  return res.send(req.post.imageOne.data);
};


// Read A POST

const read = (req, res) => {
  return res.json(req.post);
};



// ------------------------------------ LIST POSTS ----------------------------------------

const list = async (req,res) => {
  try {
    let posts = await Post
      .find({'likeLength':{$gte:100}})
      .sort("-created")
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("team","_id name")
      .populate("player","_id name")
      .populate("match","_id title")
      .populate("news","_id title")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

const listByUser = async (req, res) => {
  try {
    let posts = await Post.find({ postedBy: req.profile._id })
      .sort("-created")
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const listByTeam = async (req, res) => {
  try {
    let posts = await Post.find({ team: req.team._id})
      .sort("-created")
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByPlayer = async (req, res) => {
  try {
    let posts = await Post.find({ player: req.player._id })
      .sort("-created")
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByMatch = async (req,res) => {
  try {
    let matches = await Post.find({match: req.match._id})
      .sort("-created")
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec()
    res.json(matches)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByDepartment = async (req, res) => {
  try {
    let posts = await Post.find({ department: req.department._id, likeLength: {$gte:500} })
      .sort("-created")
      .limit(500)
      .populate("postedBy","_id name")
      .populate("department","_id name")
      .populate("job","_id title")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByJob = async (req,res) => {
  try {
    let posts = await Post.find({ job: req.job._id, likeLength: { $gte: 200 } })
      .sort("-created")
      .limit(500)
      .populate("postedBy","_id name")
      .populate("department","_id name")
      .populate("job","_id name")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByNews = async (req,res) => {
  let users = req.news.employees
  users.push(req.news.editor)
  try {
    let posts = await Post.find({ postedBy: { $in: users }, news: req.news._id,pinned: false })
      .sort('-created')
      .populate("department","_id name")
      .populate("job","_id title")
      .populate("postedBy","_id name")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByFollowings = async (req,res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  try {
    let posts = await Post.find({postedBy: {$in: req.profile.following}})
        .sort('-created')
        .populate('postedBy','_id name')
        .populate('department',"_id name")
        .populate('job',"id title")
        .exec()

    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listRelated = async (req,res) => {
  try {
    let posts = await Post.find({
      $and: [
        { _id: { $ne: req.post._id } },
        {department: req.post.department},
      ],
    })
      .sort({created:-1})
      .limit(6)
      .populate("postedBy","_id name")
      .populate("department","_id name")
      .populate("job","_id title")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

// Could use $and or aggregate
const pinnedPosts = async (req,res) => {
  try {
    let posts = await Post.find({
      news: req.news._id,
      pinned: true,
    })
      .sort("-created")
      .populate("postedBy","_id name")
      .populate("department","_id name")
      .populate("job","_id title")
      .exec();

    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


// --------------------------------  LIST FOR BESTIE AND ASIDE  --------------------------------------

const listBestMatches = async (req,res) => {
  try {
    let matches = await Post.find({ match: req.match._id })
      .sort("-likeLength")
      .limit(5)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(matches)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const latestTeam = async (req,res) => {
  try {
    let user = await User.findById(req.auth._id)
    let posts = await Post.find({
      team: user.favoriteTeam,
    })
      .sort("-created")
      .limit(7)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec()
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


// -------------------------------- TEAM MEMBER LIST POSTS ---------------------------------------


const listForPresident = async (req,res) => {
  try {
    const team = await Team.findById(req.team._id).populate("president","_id name").exec()
    let posts = await Post.find({
      team: team._id,
      postedBy: team.president._id,
    })
      .sort("-created")
      .limit(5)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
} 

// Work on it more
const listForVicePresident = async (req,res) => {
  try {
    let posts = await Post.find({
      team: req.team._id,
      postedBy: { $in: req.team.vicePresident },
    })
      .sort("-created")
      .limit(15)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
} 

const listForManager = async (req,res) => {
  try {
    let posts = await Post.find({
      team: req.team._id,
      postedBy: req.team.manager,
    })
      .sort("-created")
      .limit(5)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
} 

// Work on it more
const listForCoach = async (req,res) => {
  try {
    let posts = await Post.find({
      team: req.team._id,
      postedBy: { $in: req.team.coach },
    })
      .sort("-created")
      .limit(15)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();

    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
} 

// Work on it more
const listForScout = async (req,res) => {
  try {
    let posts = await Post.find({
      team: req.team._id,
      postedBy: { $in: req.team.scout },
    })
      .sort("-created")
      .limit(15)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
} 

// Work on it more
const listForYouth = async (req,res) => {
  try {
    let posts = await Post.find({
      team: req.team._id,
      postedBy: { $in: req.team.youth },
    })
      .sort("-created")
      .limit(15)
      .populate("postedBy", "_id name")
      .populate("department", "_id name")
      .populate("job", "_id title")
      .exec();
    res.json(posts)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
} 


//  ------------------------------- LIKE SYSTEM ---------------------------------------------

const like = async (req, res) => {
  making(Post,req.body.postId, "likes","likeLength",req.body.userId,res)
};

const unlike = async (req, res) => {
  unMaking(Post,req.body.postId, "likes","likeLength",req.body.userId,res)
};


// ---------------------------------- PIN SYSTEM ---------------------------------------------

const pin = async (req,res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      {'pinned': true},
      {new: true}
    )
    res.json(result)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const unpin = async (req,res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      {'pinned' : false},
      {new: true}
    )
    res.json(result)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


// ----------------------------- COMPLAIN ------------------------------

const complain = async (req,res) => {
  try {
    const txt = `
      <h2 style={{textAlign:'center'}} > Warning on User </h2>
      <div>
        <h4> From</h4>
        <p> ${req.body.user} </p>
      </div>
      <div>
        <h4> About</h4>
        <p> ${req.body.warning} </p>
        <p> Link :  </p>
        <a href=${req.body.link} > Post Link </a>
      </div>
      <div>
        <h4> Message</h4>
        <p> I am warning about ${req.body.warning}  </p>
      </div>
     `
    
    let result = await receiveMail(txt);
    res.json({
      message: "Your complaint are sent to us.",
      result
    })
  } catch (error) {
    return res.status(400).json({
      error: "Could not send!"
    })
  }
}


// ------------------------------- REMOVE POST ------------------------------------------------

const remove = async (req, res) => {
  try {
    let post = req.post;
    let deletedPost = await post.remove();
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};




// ------------------------------------ PERMISSIONS -------------------------------------------

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

// Work on it more
const isAudience = (req,res,next) => {
  let isAudience = req.match && req.match.audiences && req.auth && req.match.audiences.indexOf(req.auth._id) != -1
  // could it be with includes() function ? try both of them
  if(!isAudience){
    return res.status("403").json({
      error: "You should be audience of this match!"
    })
  }
  next()
}

const isEditor = async (req,res,next) => {
  try {
    let user = await User.findById(req.post.postedBy).populate('news').exec()
    let news = await News.findOne({'creator' : req.auth._id})

    if(req.post.news?.creator != req.auth._id){
      return res.status(400).json({
        error:
          "You are not allowed to carry out this operation! User does not work at your News!",
      });
    }

    if(!news){
      return res.status(401).json({
        error: "You must be editor at this User's news!"
      })
    }

    if(user.news?._id != news._id){
      return res.status(401).json({
        error: "You are not allowed to carry out this operation! User does not work at your News!"
      })
    }

    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

// Work on it more
const isJournalWorker = (req,res,next) => {
  const isApproval = req.auth && req.news && req.news?.employees?.indexOf(req.auth._id) != -1
  if(!isApproval){
    return res.status(401).json({
      error: "You are not allowed to write in this News!"
    })
  }
  next() 
}




// Increment Views

const incrementViews = async (req,res,next) => {
  try {
    await Post.findByIdAndUpdate(
      req.post._id,
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
  createForTeam,
  createForPlayer,
  createForMatch,
  createForNews,
  imageOne,
  postByID,
  read,
  remove,
  list,
  listByUser,
  listByTeam,
  listByPlayer,
  listByMatch,
  listByDepartment,
  listByJob,
  listByNews,
  listByFollowings,
  pinnedPosts,
  listRelated,
  listBestMatches,
  latestTeam,
  listForPresident,
  listForVicePresident,
  listForManager,
  listForCoach,
  listForScout,
  listForYouth,
  like,
  unlike,
  pin,
  unpin,
  complain,
  isPoster,
  isAudience,
  isEditor,
  isJournalWorker,
  incrementViews,
};