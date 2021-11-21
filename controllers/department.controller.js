import extend from "lodash/extend.js";
import formidable from 'formidable'
import fs from "fs";

import Department from "./../models/department.model.js";
import errorHandler from "./../helpers/dbErrorHandler.js";


const create = async (req, res) => {
  const department = new Department(req.body)
  try {
    await department.save();
    res.json(department);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const departmentByID = async (req, res, next, id) => {
  try {
    let department = await Department.findById(id);

    if (!department) {
      return res.status(400).json({
        error: "Department not found!",
      });
    }

    req.department = department;
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve department",
    });
  }
};

const list = async (req,res) => {
  try {
    let departments = await Department.find()

    res.json(departments)
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
}

const read = (req, res) => {
  req.department.photo = undefined
  return res.json(req.department);
};

const update = async (req, res) => {
  try {
    let department = await Department.updateOne(
      {_id : req.department._id},
      {name:req.body.name,aboutOne:req.body.aboutOne,aboutTwo:req.body.aboutTwo,aboutThree:req.body.aboutThree},
      {new:true}
    );
    
    res.json(department);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const remove = async (req,res,next) => {
  try {
    let department = req.department;
    let deletedDepartment = await department.remove();
    res.json(deletedDepartment);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
}

const incrementViews = async (req,res,next) => {
  try {
    await Department.findByIdAndUpdate(
      req.department._id,
      { $inc: { views: 1 } },
      { new: true }
    ).exec();
    next();
  } catch (error) {
    return res.status(400).error({
      error: errorHandler.getErrorMessage(error),
    });
  }
}


export default {
  create,
  departmentByID,
  list,
  read,
  update,
  remove,
  incrementViews,
};
