const dateHelper = require("../../../helpers/date.helper");

// [POST] /api/v1/tasks/create
const create = (req, res, next) => {
  const title = req.body.title;
  const status = req.body.status;
  const timeStart = req.body.time_start;
  const timeFinish = req.body.time_finish;

  if (
    !title ||
    !status ||
    !timeStart ||
    !timeFinish
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  const statusArray = ["initial", "doing", "finish", "pending", "not_finish"];
  if (!statusArray.includes(status)) {
    return res.status(400).json({
      status: false,
      message: "Status must be initial or doing or finish or pending or not_finish"
    });
  }

  const timeStartDate = new Date(timeStart);
  const timeFinishDate = new Date(timeFinish);
  if (
    !dateHelper.checkValidDate(timeStartDate) ||
    !dateHelper.checkValidDate(timeFinishDate)
  ) {
    return res.status(400).json({
      status: false,
      message: "Time invalid."
    });
  }

  if (timeStartDate > timeFinishDate) {
    return res.status(400).json({
      status: false,
      message: "Time start mus be <= Time finish."
    });
  }

  return next();
}

// [PATCH] /api/v1/tasks/update/:id
const update = (req, res, next) => {
  const title = req.body.title;
  const status = req.body.status;
  const timeStart = req.body.time_start;
  const timeFinish = req.body.time_finish;
  const parentId = req.body.parent_id;

  if (
    !title &&
    !status &&
    !timeStart &&
    !timeFinish &&
    !parentId
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  const statusArray = ["initial", "doing", "finish", "not_finish", "pending"];
  if (
    status &&
    !statusArray.includes(status)
  ) {
    return res.status(400).json({
      status: false,
      message: "Status must be initial or doing or finish or not_finish or pending."
    });
  }

  const timeStartDate = new Date(timeStart);
  if (
    timeStart &&
    !dateHelper.checkValidDate(timeStartDate)
  ) {
    return res.status(400).json({
      status: false,
      message: "Time start must be date."
    });
  }

  const timeFinishDate = new Date(timeFinish);
  if (
    timeFinish &&
    !dateHelper.checkValidDate(timeFinishDate)
  ) {
    return res.status(400).json({
      status: false,
      message: "Time finish must be date."
    });
  }

  if (
    timeStart &&
    timeFinish &&
    timeStartDate > timeFinishDate
  ) {
    return res.status(400).json({
      status: false,
      message: "Time start must be <= Time finish."
    });
  }

  return next();
}

// [PATCH] /api/v1/tasks/change-multi
const changeMulti = (req, res, next) => {
  const key = req.body.key;
  const ids = req.body.ids;

  if (
    !key ||
    !ids
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  if (!ids.length) {
    return res.status(400).json({
      status: false,
      message: "Ids must be not empty."
    });
  }

  return next();
}

const taskValidate = {
  create,
  update,
  changeMulti
};
module.exports = taskValidate;