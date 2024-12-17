const express = require("express");
const router = express.Router();

const deserializeUser = require("../middlewares/deserializeUser.middleware");
const validate = require("../validates/taskDetail.validate");

const controller = require("../controllers/taskDetail.controller");

router.get(
  "/get/:task_id",
  [deserializeUser],
  controller.get
);

router.post(
  "/create",
  [deserializeUser, validate.create],
  controller.create
);

router.delete(
  "/delete/:task_id",
  [deserializeUser],
  controller.del
);

module.exports = router;