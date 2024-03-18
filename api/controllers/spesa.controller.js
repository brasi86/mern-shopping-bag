import { errorHandler } from "../utils/error.js";
import Spesa from "../models/spesa.model.js";

export const addSpesa = async (req, res, next) => {
  const newSpesa = new Spesa({
    nucleo: req.query.nucleo,
    importo: req.body.spesa,
  });
  try {
    await newSpesa.save();
    res.status(200).json(newSpesa);
  } catch (error) {
    next(error);
  }
};
