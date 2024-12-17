const mongoose = require("mongoose");

const TaskDetailSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks",
    required: true
  }
}, {
  timestamps: true
});

const TaskDetailModel = mongoose.model("TaskDetailModel", TaskDetailSchema, "task_details");
module.exports = TaskDetailModel;