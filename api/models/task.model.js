import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    pezzi: {
      type: Number,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    nucleo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
