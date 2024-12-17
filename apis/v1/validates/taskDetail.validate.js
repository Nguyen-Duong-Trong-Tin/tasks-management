// [POST] /api/v1/task-details/create
const create = (req, res, next) => {
  const userId = req.body.user_id;
  const taskId = req.body.task_id;

  if (
    !userId ||
    !taskId
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  if (
    typeof userId !== "string" ||
    typeof taskId !== "string"
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing datatype."
    });
  }

  return next();
}

const taskDetail = {
  create
};
module.exports = taskDetail;