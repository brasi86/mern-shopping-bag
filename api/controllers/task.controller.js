import { errorHandler } from "../utils/error.js";
import Task from "../models/task.model.js";

export const addTask = async (req, res, next) => {
  const { task, userId } = req.body;

  if (req.user.id !== userId) {
    return errorHandler(404, "Non puoi effettuare questa operazione.");
  }

  const taskDuplicate = await Task.find({ task: task });

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
