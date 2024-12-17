const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["initial", "doing", "finish", "pending", "not_finish"],
    required: true
  },
  time_start: {
    type: Date,
    required: true
  },
  time_finish: {
    type: Date,
    required: true
  },
  parent_id: {
    type: String
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  updated_at: {
    type: Date
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date
  }
});

const TaskModel = mongoose.model("TaskModel", TaskSchema, "tasks");
module.exports = TaskModel;