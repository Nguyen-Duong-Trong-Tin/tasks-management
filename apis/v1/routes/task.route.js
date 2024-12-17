const express = require("express");
const router = express.Router();

const deserizalizeUser = require("../middlewares/deserializeUser.middleware.js");
const validate = require("../validates/task.validate");

const controller = require("../controllers/task.controller");

router.get(
  "/get",
  [deserizalizeUser],
  controller.get
);
router.get(
  "/get/:id",
  [deserizalizeUser],
  controller.getById
);

router.post(
  "/create",
  [deserizalizeUser, validate.create],
  controller.create
);

router.patch(
  "/update/:id",
  [deserizalizeUser, validate.update],
  controller.update
);
router.patch(
  "/change-multi",
  [deserizalizeUser, validate.changeMulti],
  controller.changeMulti
);

router.delete(
  "/delete/:id", 
  [deserizalizeUser],
  controller.del
);

module.exports = router;