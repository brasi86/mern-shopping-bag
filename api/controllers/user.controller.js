import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ msg: "Il messaggio arriva dal back-end" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "Impossibile aggiornare i dati dell'utente.")
    );
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Impossibile aggiornare i dati dell'utente.")
      );
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Il nome utente non può avere meno di 6 caratteri.")
      );
    }

    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Il nome utente non può contenere spazi."));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(
        errorHandler(400, "Il nome utente può avere solo caratteri minuscoli.")
      );
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Il nome utente può contenere solo lettere e numeri.")
      );
    }
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next("error");
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Impossibile eliminare questo account."));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Account eliminato con successo");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("Utente disconnesso con successo");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  const { nucleo } = req.query;

  try {
    const users = await User.find({
      ...(nucleo && { nucleo: nucleo }),
    });

    const usersNoPass = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    res.status(200).json({
      users: usersNoPass,
    });
  } catch (error) {
    next(error);
  }
};

export const nucleoUser = async (req, res, next) => {
  if (req.params.nucleoId === req.user.nucleo) {
    return next(errorHandler(404, "Appartieni già a quel nucleo famigliare."));
  }

  try {
    const updateNucleoUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          nucleo: req.params.nucleoId,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateNucleoUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next("error");
  }
};
