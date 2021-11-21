import errorHandler from "./dbErrorHandler.js";

// Hiring To Team

const hirePerson = async (Team, teamId, job, userId, res, next) => {
  try {
    await Team.findByIdAndUpdate(teamId, { [job]: userId }, { new: true });

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const hirePeople = async (Team, teamId, job, jobLength, userId, res, next) => {
  try {
    await Team.findByIdAndUpdate(
      teamId,
      {
        $push: { [job]: userId },
        $inc: { [jobLength]: 1 },
      },
      { new: true }
    );

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const appointPerson = async (User, userId, field, fieldId, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      userId,
      { [field]: fieldId },
      { new: true }
    )
      .populate("department", "_id name")
      .populate("news", "_id title")
      .populate("job", "_id title")
      .populate("team", "_id name")
      .populate("favoriteTeam", "_id name")
      .exec();

    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

// Firing From Team

const fireResign = async (Model, job, jobLength, userId, teamId, res, next) => {
  try {
    await Model.findByIdAndUpdate(
      teamId,
      { $pull: { [job]: userId }, $inc: { [jobLength]: -1 } },
      { new: true }
    );

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const fireResignPerson = async (Model, modelId, job, res, next) => {
  try {
    await Model.findByIdAndUpdate(
      modelId,
      { $unset: { [job]: 1 } },
      { new: true }
    );

    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

const rejectPerson = async (User, userId, field, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      userId,
      { $unset: { [field]: 1 } },
      { new: true }
    )
      .populate("department", "_id name")
      .populate("job", "_id title")
      .populate("favoriteTeam", "_id name")
      .exec();

    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

export {
  fireResign,
  fireResignPerson,
  rejectPerson,
  hirePerson,
  hirePeople,
  appointPerson,
};
