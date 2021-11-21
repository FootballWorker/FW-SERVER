import formidable from 'formidable'
import extend from 'lodash/extend.js'
import fs from 'fs'

import News from './../models/news.model.js'
import User from './../models/user.model.js'
import errorHandler from './../helpers/dbErrorHandler.js'
import {making, unMaking, unWithoutLength, withoutLength} from './../helpers/starSubscribe.js'
import { appointPerson, fireResignPerson, hirePerson, rejectPerson } from '../helpers/hireFireResign.js'



// CRUD

const create = async (req,res) => {
  try {
    const user = await User.findById(req.auth._id)
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Could not upload photo!",
        });
      }
      let news = new News(fields);
      news.creator = user._id;
      news.editor = user._id;
      news.subscribers.push(user._id)
      news.subscriberLength = news.subscriberLength + 1
      user.news = news._id
      if (fields.photo) {
        news.photo.data = fs.readFileSync(files.photo.path);
        news.photo.contentType = files.photo.type;
      }
      try {
        await user.save()
        let result = await news.save();
        res.json(result);
      } catch (error) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(error),
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error:errorHandler.getErrorMessage(error)
    })
  }
  
}

const newsByID = async (req,res,next,id) => {
  try {
    let news = await News.findById(id)
      .populate("creator", "_id name")
      .populate("editor", "_id name")
      .populate("employees", "_id name")
      .populate("applications")
      .populate("subscribers", "_id name")
      .exec();
    if(!news){
      return res.status(400).json({
        error: "Could not retrieve News"
      })
    }
    req.news = news
    next()
  } catch (error) {
    return res.status(400).json({
      error: "Could not get News!"
    })
  }
}

// Photos

const photo = (req, res, next) => {
  if (req.news.photo.data) {
    res.set("Content-Type", req.news.photo.contentType);
    return res.send(req.news.photo.data);
  }
  next();
};

const read = (req,res) => {
  return res.json(req.news)
}

const update = (req,res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err,fields,files)=>{
    if(err){
      return res.status(400).json({
        error: "Could not upload Photo"
      })
    }
    let media = req.news
    media = extend(media,fields)
    media.updated = Date.now()

    if(files.photo) {
      media.photo.data = fs.readFileSync(files.photo.path);
      media.photo.contentType = files.photo.type;
    }


    try {
      await media.save()
      res.json(media)
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      })
    }
  })
}

const remove = async (req,res) => {
  try {
    let news = req.news
    let deletedNews = await news.remove()
    res.json(deletedNews)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}






// Listing

const list = async (req,res) => {
  try {
    let news = await News.find().sort("-created").populate('editor','_id name').exec()
    res.json(news)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listByUser = async (req,res) => {
  try {
    let news = await News.find({
      subscribers: {$in:req.profile._id}
    })
    res.json(news)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const listTop = async (req,res) => {
  try {
    let news = await News.find({subscriberLength: { $gte : 10}}).limit(7).exec();
    res.json(news);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}



// Application

const applyFor = async (req,res) => {
  withoutLength(News,req.body.newsId,"applications",req.body.userId,res)
}

const cancelApply = async (req,res) => {
  unWithoutLength(News,req.body.newsId,"applications",req.body.userId,res)
}



// Hire and Fire System

const hireEditor = (req,res,next) => {
  hirePerson(News,req.body.newsId,"editor",req.body.userId,res,next)
}

const appointEditor = (req,res) => {
  appointPerson(User,req.body.userId,"news",req.body.newsId,res)
}

const hireEmployee = async (req,res,next) => {
  try {
    await News.findByIdAndUpdate(
      req.body.newsId,
      {$push:{employees: req.body.userId}},
      {new:true}
    )
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const appointedToNews = (req,res) => {
  appointPerson(User,req.body.userId,"news",req.body.newsId,res)
}

const fireEditor = (req,res,next) => {
  fireResignPerson(News,req.body.newsId,"editor",res,next)
}

const rejectEditor = (req,res) => {
  rejectPerson(User,req.body.userId,"news",res)
}

const fireEmployee = async (req,res,next) => {
  try {
    await News.findByIdAndUpdate(
      req.body.newsId,
      {$pull:{employees:req.body.userId}},
      {new:true}
    )

    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const rejectedFromNews = (req,res) => {
  rejectPerson(User,req.body.userId,"news",res)
}


// Subscribe

const subscribe = (req,res) => {
  making(News,req.body.newsId,"subscribers","subscriberLength",req.body.userId,res)
}

const unsubscribe = (req,res) => {
  unMaking(News,req.body.newsId,"subscribers","subscriberLength",req.body.userId,res)
}


// Permissions 

const isCreator = (req,res,next) => {
  let isCreator = req.auth && req.news && req.news.creator._id == req.auth._id
  if(!(isCreator)){
    return res.status(401).json({
      error: "You are not allowed to make this operation"
    })
  }
  next()
}

const isEditor = async (req,res,next) => {
  try {
    let editor = req.auth?._id == req.news?.editor?._id
    if(!(editor)){
      return res.status(403).json({
        error: "You must be editor of this newspaper!"
      })
    }
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const isNotEmployee = async (req,res,next) => {
  try {
    const user = User.findById(req.body.userId);
    const news = News.findById(req.body.newsId);

    if (news.applications.filter((employee) => employee._id.toString() === user._id).length <= 0) {
      return res.status(403).json({
        error: "User not apply for job!",
      });
    }

    if(user.news){
      return res.status(400).json({
        error: "User have already a job!"
      })
    }
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}

const isEmployee = async (req,res,next) => {
  try {
    let user = await User.findById(req.body.userId).populate("news").exec()
    if(!user.news){
      return res.status(400).json({
        error: "This person has not a job!"
      })
    }
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


// Increment Views

const incrementViews = async (req,res,next) => {
  try {
    await News.findByIdAndUpdate(
      req.news._id,
      {$inc:{views:1}},
      {new:true}
    )
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


export default {
  create,
  newsByID,
  read,
  update,
  remove,
  photo,
  list,
  listByUser,
  listTop,
  applyFor,
  cancelApply,
  hireEditor,
  appointEditor,
  hireEmployee,
  appointedToNews,
  fireEditor,
  rejectEditor,
  fireEmployee,
  rejectedFromNews,
  subscribe,
  unsubscribe,
  isCreator,
  isEditor,
  isNotEmployee,
  isEmployee,
  incrementViews
}