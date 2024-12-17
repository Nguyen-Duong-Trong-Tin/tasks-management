const validateHelper = require("../../../helpers/validate.helper");

// [POST] /api/v1/users/register
const register = (req, res, next) => {
  const fullName = req.body.full_name;
  const email = req.body.email;
  const password = req.body.password;
  const status = req.body.status;
  const role = req.body.role;

  if (
    !fullName ||
    !email ||
    !password ||
    !status ||
    !role
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  if (!validateHelper.validateEmail(email)) {
    return res.status(400).json({
      status: false,
      message: "Email invalid."
    });
  }

  if (!validateHelper.validatePassword(password)) {
    return res.status(400).json({
      status: false,
      message: "Password must minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    });
  }

  if (
    status !== "active" &&
    status !== "inactive"
  ) {
    return res.status(400).json({
      status: false,
      message: "Status must be active or inactive."
    });
  }

  if (
    role !== "USER" &&
    role !== "ADMIN"
  ) {
    return res.status(400).json({
      status: false,
      message: "Role must be USER or ADMIN."
    });
  }

  return next();
}

// [POST] /api/v1/users/login
const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (
    !email ||
    !password
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  return next();
}

// [POST] /api/v1/users/password/forgot
const forgotPassword = (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  if (!validateHelper.validateEmail(email)) {
    return res.status(400).json({
      status: false,
      message: "Email is invalid."
    });
  }

  return next();
}

// [POST] /api/v1/users/password/otp
const otp = (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;

  if (
    !email ||
    !otp
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  if (!validateHelper.validateEmail(email)) {
    return res.status(400).json({
      status: false,
      message: "Email is invalid."
    });
  }

  return next();
}

// [POST] /api/v1/users/password/reset
const resetPassword = (req, res, next) => {
  const email = req.body.email;
  const newPassword = req.body.new_password;

  if (
    !email ||
    !newPassword
  ) {
    return res.status(400).json({
      status: false,
      message: "Missing required information."
    });
  }

  if (!validateHelper.validateEmail(email)) {
    return res.status(400).json({
      status: false,
      message: "Email is incorrect."
    });
  }

  if (!validateHelper.validatePassword(newPassword)) {
    return res.status(400).json({
      status: false,
      message: "Password is incorrect."
    });
  }
  
  return next();
}

const userValidate = {
  register,
  login,
  forgotPassword,
  otp,
  resetPassword
};
module.exports = userValidate;