import mongoose from "mongoose";

const generateRandomNucleo = () => {
  return (
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
  );
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    nucleo: {
      type: String,
      default: generateRandomNucleo,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
