const taskService = require("../services/task.service");

const taskHelper = require("../../../helpers/task.helper");

// [GET] /api/v1/tasks/get?status?=:status&sort_key?=:sortKey&sort_value?=:sortValue&page=:page&limit=:limit
const get = async (req, res) => {
  try {
    const find = await taskHelper.find(req);
    const sort = taskHelper.sort(req.query);
    const pagination = taskHelper.pagination(req.query);

    const tasks = await taskService.find(
      find,
      sort,
      pagination
    );
    return res.status(200).json({
      status: true,
      message: "Tasks found.",
      data: tasks
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [GET] /api/v1/tasks/get/:id
const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskService.findById(id);
    return res.status(200).json({
      status: true,
      message: "Task found.",
      data: task
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/tasks/create
const create = async (req, res) => {
  try {
    const userId = req.user._id;

    const title = req.body.title;
    const status = req.body.status;
    const timeStart = req.body.time_start;
    const timeFinish = req.body.time_finish;
    const parentId = req.body.parent_id;

    const parentTaskExists = await taskService.findById(parentId);
    if (parentId && !parentTaskExists) {
      return res.status(400).json({
        status: false,
        message: "Task parent id not found."
      });
    }

    const newTask = await taskService.create({
      title: title,
      status: status,
      time_start: timeStart,
      time_finish: timeFinish,
      created_by: userId,
      created_at: Date.now(),
      parent_id: parentId
    });
    return res.status(201).json({
      statua: true,
      message: "Task was created successfully.",
      data: newTask
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/tasks/update/:id
const update = async (req, res) => {
  try {
    const id = req.params.id;

    const userId = req.user._id;

    const title = req.body.title;
    const status = req.body.status;
    const timeStart = req.body.time_start;
    const timeFinish = req.body.time_finish;
    const parentId = req.body.parent_id;

    const parentTaskExists = await taskService.findById(parentId);
    if (parentId && !parentTaskExists) {
      return res.status(400).json({
        status: false,
        message: "Task parent id not found."
      });
    }

    const taskExists = await taskService.findById(id);
    if (!taskExists) {
      return res.status(404).json({
        status: false,
        message: "Task id not found."
      });
    }

    if (timeStart && !timeFinish) {
      const timeStartDate = new Date(timeStart);
      if (timeStartDate > taskExists.time_finish) {
        return res.status(400).json({
          status: false,
          message: "Time start must be <= Time finish."
        });
      }
    }

    if (!timeStart && timeFinish) {
      const timeFinishDate = new Date(timeFinish);
      if (taskExists.time_start > timeFinishDate) {
        return res.status(400).json({
          status: false,
          message: "Time start must be <= Time finish."
        });
      }
    }

    const newTask = await taskService.update(id, {
      title: title,
      status: status,
      time_start: timeStart,
      time_finish: timeFinish,
      updated_by: userId,
      updated_at: Date.now()
    });
    return res.status(200).json({
      status: true,
      message: "Task was updated successfully.",
      data: newTask
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/tasks/change-multi
const changeMulti = async (req, res) => {
  try {
    const userId = req.user._id;

    const key = req.body.key;
    const ids = req.body.ids;

    for (const id of ids) {
      const taskExists = await taskService.findById(id);
      if (!taskExists) {
        return res.status(404).json({
          status: false,
          message: "Task ids not found."
        });
      }
    }

    let newTasks = [];
    switch (key) {
      case "status": {
        const newStatus = req.body.new_status;
        if (!newStatus) {
          return res.status(400).json({
            status: false,
            message: "Missing required information."
          });
        }

        newTasks = await taskService.updateMany(ids, {
          updated_by: userId,
          updated_at: Date.now(),
          status: newStatus
        });
        break;
      }

      case "delete": {
        newTasks = await taskService.updateMany(ids, {
          updated_by: userId,
          updated_at: Date.now(),
          deleted: true,
          deleted_at: new Date()
        });

        break;
      }

      default:
        break;
    }

    return res.status(200).json({
      status: true,
      message: "Tasks were updated sucessfully.",
      data: newTasks
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [DELETE] /api/v1/tasks/delete/:id
const del = async (req, res) => {
  try {
    const userId = req.user._id;

    const id = req.params.id;

    const taskExists = await taskService.findById(id);
    if (!taskExists) {
      return res.status(404).json({
        status: false,
        message: "Task id not found."
      });
    }

    const newTask = await taskService.update(id, {
      updated_by: userId,
      updated_at: Date.now(),
      deleted: true,
      deleted_at: new Date()
    });
    return res.status(200).json({
      status: true,
      message: "Task was deleted successfully.",
      data: newTask
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const taskController = {
  get,
  getById,
  create,
  update,
  changeMulti,
  del
};
module.exports = taskController;