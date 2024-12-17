const express = require("express");
const router = express.Router();

const deserializeUser = require("../middlewares/deserializeUser.middleware");
const validate = require("../validates/user.validate");

const controller = require("../controllers/user.controller");

router.get(
  "/me",
  [deserializeUser],
  controller.getMe
);

router.post(
  "/register",
  validate.register,
  controller.register
);
router.post(
  "/login",
  validate.login,
  controller.login
);
router.post(
  "/refresh_token",
  controller.refreshToken
);

router.post(
  "/password/forgot",
  validate.forgotPassword,
  controller.forgotPassword
);
router.post(
  "/password/otp",
  validate.otp,
  controller.otp
);
router.patch(
  "/password/reset",
  [deserializeUser, validate.resetPassword],
  controller.resetPassword
);

module.exports = router;