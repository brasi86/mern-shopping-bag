import { errorHandler } from "../utils/error.js";
import Spesa from "../models/spesa.model.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

export const addSpesa = async (req, res, next) => {
  const newSpesa = new Spesa({
    nucleo: req.query.nucleo,
    importo: req.body.spesa,
  });
  try {
    await Task.deleteMany({
      nucleo: req.query.nucleo,
    });

    await newSpesa.save();
    res.status(200).json(newSpesa);
  } catch (error) {
    next(error);
  }
};

export const getSpese = async (req, res, next) => {
  try {
    const usersInSameNucleo = await User.find({ nucleo: req.query.nucleo });

    const userIds = usersInSameNucleo.map((user) => user._id);

    if (!userIds.some((id) => id.toString() === req.query.userId)) {
      return next(errorHandler(403, "Qualcosa è andato storto."));
    }

    const spese = await Spesa.find({ nucleo: req.query.nucleo });

    res.status(200).json(spese);
  } catch (error) {
    next(error);
  }
};
