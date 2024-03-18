import { errorHandler } from "../utils/error.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const getTasks = async (req, res, next) => {
  try {
    const allTasks = await Task.find({ nucleo: req.query.nucleo }).sort({
      createdAt: -1,
    });

    const totalTasks = await Task.countDocuments({ nucleo: req.query.nucleo });

    res.status(200).json({ allTasks, totalTasks });
  } catch (error) {
    next(error);
  }
};

export const addTask = async (req, res, next) => {
  const { task } = req.body;

  const { userId, nucleo } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return next(errorHandler(404, "Utente non trovato."));
  }

  const taskDuplicate = await Task.findOne({
    nucleo: nucleo,
    task: task,
  });

  if (taskDuplicate) {
    return next(errorHandler(402, "Articolo già inserito."));
  }

  const newTask = new Task({
    task,
    nucleo: nucleo,
  });

  try {
    await newTask.save();
    res.status(200).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTasks = async (req, res, next) => {
  const { task, _id } = req.body;

  const { nucleo, userId } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return next(errorHandler(404, "Utente non trovato."));
  }

  const usersInSameNucleo = await User.find({
    nucleo: nucleo,
  });

  const userIds = usersInSameNucleo.map((user) => user._id);

  if (!userIds.some((id) => id.toString() === userId)) {
    return next(errorHandler(403, "Non puoi eliminare questo articolo."));
  }

  try {
    await Task.findOneAndDelete({ nucleo: nucleo, task: task, _id: _id });

    res.status(200).json("La task è stata eliminata");
  } catch (error) {
    next(error);
  }
};

export const updateTasks = async (req, res, next) => {
  const { task, _id } = req.body;

  const { nucleo, userId } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return next(errorHandler(404, "Utente non trovato."));
  }

  const usersInSameNucleo = await User.find({
    nucleo: nucleo,
  });

  const userIds = usersInSameNucleo.map((user) => user._id);

  if (!userIds.some((id) => id.toString() === userId)) {
    return next(errorHandler(403, "Non puoi modificare questo articolo."));
  }

  const taskDuplicate = await Task.findOne({
    nucleo: nucleo,
    task: task,
  });

  if (taskDuplicate) {
    return next(errorHandler(402, "Articolo già inserito."));
  }
  try {
    const updateTasks = await Task.findByIdAndUpdate(
      _id,
      {
        $set: {
          task: task,
          complete: req.body.complete,
          nucleo: nucleo,
        },
      },
      { new: true }
    );

    res.status(200).json(updateTasks);
  } catch (error) {
    next(error);
  }
};

export const completeTasks = async (req, res, next) => {
  const { task, _id, complete } = req.body;

  const { nucleo, userId } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return next(errorHandler(404, "Utente non trovato."));
  }

  const usersInSameNucleo = await User.find({
    nucleo: nucleo,
  });

  const userIds = usersInSameNucleo.map((user) => user._id);

  if (!userIds.some((id) => id.toString() === userId)) {
    return next(errorHandler(403, "Non puoi modificare questo articolo."));
  }

  try {
    const updateTasks = await Task.findByIdAndUpdate(
      _id,
      {
        $set: {
          task: task,
          complete: !complete,
          nucleo: nucleo,
        },
      },
      { new: true }
    );

    res.status(200).json(updateTasks);
  } catch (error) {
    next(error);
  }
};
