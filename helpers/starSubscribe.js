import errorHandler from './dbErrorHandler.js'


const making = async (Model,bodyId, field,fieldLength,userId,res) => {
  try {
    let result = await Model.findByIdAndUpdate(
      bodyId,
      { $push: { [field]: userId },$inc: { [fieldLength]: 1 } },
      { new: true }
    );
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
}

const unMaking = async (Model,bodyId, field,fieldLength,userId,res) => {
  try {
    let result = await Model.findByIdAndUpdate(
      bodyId,
      { $pull: { [field]: userId }, $inc: { [fieldLength]: -1 } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

const withoutLength = async (Model,modelId,field,userId,res) => {
  try {
    let result = await Model.findByIdAndUpdate(
      modelId,
      {$push: {[field]: userId}},
      {new:true}
    )
    res.json(result) 
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}
const unWithoutLength = async (Model,modelId,field,userId,res) => {
  try {
    let result = await Model.findByIdAndUpdate(
      modelId,
      {$pull: {[field]: userId}},
      {new:true}
    )
    res.json(result) 
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    })
  }
}


export {making,unMaking,withoutLength,unWithoutLength}