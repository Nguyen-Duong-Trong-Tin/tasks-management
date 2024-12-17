const TaskDetailModel = require("../models/taskDetail.model")

const findByUserId = async (userId) => {
  const taskDetails = await TaskDetailModel.find({
    user_id: userId
  });
  return taskDetails;
}

const findByTaskId = async (taskId) => {
  const taskDetails = await TaskDetailModel.find({
    task_id: taskId
  });
  return taskDetails;
}

const findByUserIdAndTaskId = async (userId, taskId) => {
  const taskExists = await TaskDetailModel.findOne({
    user_id: userId,
    task_id: taskId
  });
  return taskExists;
}

const create = async (taskDetail) => {
  const newTaskDetail = new TaskDetailModel(taskDetail);
  await newTaskDetail.save();
  return newTaskDetail;
}

const del = async (taskId) => {
  await TaskDetailModel.deleteMany({
    task_id: taskId
  });
}

const taskDetailService = {
  findByUserId,
  findByTaskId,
  findByUserIdAndTaskId,
  create,
  del
};
module.exports = taskDetailService;