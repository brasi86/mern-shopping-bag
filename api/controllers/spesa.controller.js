import { errorHandler } from "../utils/error.js";
import Spesa from "../models/spesa.model.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

export const addSpesa = async (req, res, next) => {
  const newSpesa = new Spesa({
    nucleo: req.query.nucleo,
    importo: req.body.importo,
    articoli: req.body.articoli,
    luogo: req.body.luogo,
  });
  try {
    await Task.deleteMany({
      nucleo: req.query.nucleo,
      complete: true,
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

    const totaleSpese = await Spesa.aggregate([
      { $match: { nucleo: req.query.nucleo } },
      { $group: { _id: req.query.nucleo, total: { $sum: "$importo" } } },
    ]);

    res.status(200).json({ spese, totaleSpese });
  } catch (error) {
    next(error);
  }
};
