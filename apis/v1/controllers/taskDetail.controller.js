const taskService = require("../services/task.service");
const taskDetailService = require("../services/taskDetail.service");
const userService = require("../services/user.service");

// [GET] /api/v1/task-details/get/:task_id
const get = async (req, res) => {
  try {
    const taskId = req.params.task_id;

    const taskExists = await taskService.findById(taskId);
    if (!taskExists) {
      return res.status(400).json({
        status: false,
        message: "Task id not found."
      });
    }

    const taskDetails = await taskDetailService.findByTaskId(taskId);
    return res.status(200).json({
      status: true,
      message: "Task details found.",
      data: taskDetails
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/task-details/create
const create = async (req, res) => {
  try {
    const myUserId = req.user._id;

    const userId = req.body.user_id;
    const taskId = req.body.task_id;

    const userExists = await userService.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User id not found."
      });
    }

    const taskExists = await taskService.findById(taskId);
    if (!taskExists) {
      return res.status(400).json({
        status: false,
        message: "Task id not found."
      });
    }

    const taskDetailExists = await taskDetailService.findByUserIdAndTaskId(userId, taskId);
    if (taskDetailExists) {
      return res.status(400).json({
        status: false,
        message: "Task detail already exists."
      });
    }

    const newTaskDetail = await taskDetailService.create({
      user_id: userId,
      task_id: taskId
    });

    await taskService.update(taskId, {
      updated_by: myUserId,
      updated_at: Date.now()
    });
    return res.status(201).json({
      status: true,
      message: "Task detail was created successfully.",
      data: newTaskDetail
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [DELETE] /api/v1/task-details/delete/:task_id
const del = async (req, res) => {
  try {
    const myUserId = req.user._id;

    const taskId = req.params.task_id;

    const taskExists = await taskService.findById(taskId);
    if (!taskExists) {
      return res.status(400).json({
        status: false,
        message: "Task id not found."
      });
    }

    await taskDetailService.del(taskId);

    await taskService.update(taskId, {
      updated_by: myUserId,
      update_at: Date.now()
    });

    return res.status(200).json({
      status: true,
      message: "Task detail were deleted successfully."
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const taskDetailController = {
  get,
  create,
  del
};
module.exports = taskDetailController;