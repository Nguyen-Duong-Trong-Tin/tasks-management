const TaskModel = require("../models/task.model");

const find = async (
  find,
  sort,
  pagination
) => {
  const tasks = await TaskModel
    .find(find)
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit);
  return tasks;
}

const findById = async (id) => {
  const task = await TaskModel.findOne({
    deleted: false,
    _id: id
  });
  return task;
}

const create = async (task) => {
  const newTask = new TaskModel(task);
  await newTask.save();
  return newTask;
}

const update = async (id, task) => {
  const newTask = await TaskModel.findOneAndUpdate({
    _id: id,
    deleted: false
  }, task, {
    new: true
  });
  return newTask;
}

const updateMany = async (ids, task) => {
  const tasks = [];
  for (const id of ids) {
    const newTask = await TaskModel.findOneAndUpdate({
      _id: id,
      deleted: false
    }, task, {
      new: true
    });
    tasks.push(newTask);
  }
  return tasks;
}

const taskService = {
  find,
  findById,
  create,
  update,
  updateMany
};
module.exports = taskService;