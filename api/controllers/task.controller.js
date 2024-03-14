import { errorHandler } from "../utils/error.js";
import Task from "../models/task.model.js";

export const addTask = async (req, res, next) => {
  const { task, userId } = req.body;

  if (req.user.id !== userId) {
    return errorHandler(404, "Non puoi effettuare questa operazione.");
  }

  const taskDuplicate = await Task.find({ userId: req.user.id, task: task });

  if (taskDuplicate.length > 0) {
    return next(errorHandler(402, "Articolo già inserito."));
  }

  const newTask = new Task({
    task,
    userId: req.user.id,
  });

  try {
    await newTask.save();

    res.status(200).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const allTasks = await Task.find({ userId: req.query.userId });
    const totalTasks = await Task.countDocuments({ userId: req.query.userId });

    res.status(200).json({ allTasks, totalTasks });
  } catch (error) {
    next(error);
  }
};

export const deleteTasks = async (req, res, next) => {
  if (req.params.userId !== req.body.userId) {
    return next(errorHandler(402, "Non posso eliminare questo articolo"));
  }
  try {
    await Task.findByIdAndDelete(req.body._id);
    res.status(200).json("La task è stata eliminata");
  } catch (error) {
    next(error);
  }
};

export const updateTasks = async (req, res, next) => {
  if (req.params.userId !== req.body.userId) {
    return next(errorHandler(402, "Non posso eliminare questo articolo"));
  }

  const taskDuplicate = await Task.find({ task: req.body.task });

  if (taskDuplicate.length > 0) {
    return next(errorHandler(402, "Articolo già inserito."));
  }

  try {
    const updateTasks = await Task.findByIdAndUpdate(
      req.body._id,
      {
        $set: {
          task: req.body.task,
          complete: req.body.complete,
          userId: req.body.userId,
        },
      },
      { new: true }
    );

    res.status(200).json(updateTasks);
  } catch (error) {
    next(error);
  }
};
