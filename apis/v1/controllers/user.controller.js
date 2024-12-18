const md5 = require("md5");

const userService = require("../services/user.service");
const forgotPasswordSerive = require("../services/forgotPassword.service");

const generateHelper = require("../../../helpers/generate.helper");
const sendMail = require("../../../helpers/sendmail.helper");

const jwtUtil = require("../../../utils/jwt.util");

// [GET] /api/v1/users
const get = async (req, res) => {
  try {
    const users = await userService.find();
    return res.status(200).json({
      status: true,
      message: "Users found.",
      users: users
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [GET] /api/v1/users/me
const getMe = async (req, res) => {
  try {
    const id = req.user._id;

    const userExists = await userService.findById(id);
    if (!userExists) {
      return res.status(404).json({
        status: false,
        message: "User id not found."
      });
    }
    return res.status(200).json({
      status: true,
      message: "User found.",
      data: userExists
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/register
const register = async (req, res) => {
  try {
    const fullName = req.body.full_name;
    const email = req.body.email;
    const password = req.body.password;
    const status = req.body.status;
    const role = req.body.role;

    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        status: false,
        message: "User email already exists."
      });
    }

    const newUser = await userService.create({
      full_name: fullName,
      email: email,
      password: md5(password),
      status: status,
      role: role
    });
    return res.status(201).json({
      status: true,
      message: "User was created successfully.",
      data: newUser
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/login
const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userExists = await userService.login(email, md5(password));
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "Email or password incorrect."
      });
    }

    if (userExists.status === "inactive") {
      return res.status(400).json({
        status: false,
        message: "User was inactive."
      });
    }

    const accessToken = jwtUtil.generateToken({
      _id: userExists.id,
      role: userExists.role
    }, "1d");

    const refreshToken = jwtUtil.generateToken({
      _id: userExists.id,
      role: userExists.role
    }, "7d");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({
      status: true,
      message: "Login successfully.",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    });
  } catch(e) {
    console.log(e);
    
    return res.status(500).json({
      status: false,
      message: "Something went wrong.",
      error: e
    });
  }
}

// [POST] /api/v1/users/refresh_token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    const refreshTokenVerify = jwtUtil.verify(refreshToken);

    if (!refreshTokenVerify.valid) {
      return res.status(401).json({
        status: false,
        message: "Your refresh token is incorrect or expires."
      });
    }

    const userId = refreshTokenVerify.data._id;
    const userExists = await userService.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User id not found."
      });
    }

    const accessToken = jwtUtil.generateToken({
      _id: userExists.id,
      role: userExists.role
    }, "1d");
    return res.status(200).json({
      status: true,
      message: "Refresh token successfully.",
      data: {
        access_token: accessToken
      }
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/password/forgot
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const userExists = await userService.findByEmail(email);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User email not found."
      });
    }

    const otp = generateHelper.generateOTP(6);
    const forgotPasswordExists = await forgotPasswordSerive.findByEmailAndOTP(email, otp);
    if (forgotPasswordExists) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }

    await forgotPasswordSerive.create({
      email: email,
      otp: otp
    });

    sendMail(
      email,
      "Gửi Mã OTP",
      `
        <h1>Xin Chào<h1/>
        <p>Đây là mã OTP của bạn: <b>${otp}</b></p>
        <p>Vui lòng không chia sẻ mã này cho ai khác.</p>
      `
    );

    return res.status(200).json({
      status: true,
      message: "Forgot password was created successfully."
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [POST] /api/v1/users/password/otp
const otp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotPasswordExists = await forgotPasswordSerive.findByEmailAndOTP(email, otp);
    if (!forgotPasswordExists) {
      return res.status(400).json({
        status: false,
        message: "Email or OTP is incorrect or expire."
      });
    }

    const userExists = await userService.findByEmail(email);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User email not found."
      });
    }

    const accessToken = jwtUtil.generateToken({
      _id: userExists.id,
      role: userExists.role
    }, "7d");

    const refreshToken = jwtUtil.generateToken({
      _id: userExists.id,
      role: userExists.role
    }, "7d");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      expire: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({
      status: true,
      message: "OTP is correct.",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

// [PATCH] /api/v1/users/password/reset
const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.new_password;

    const userExists = await userService.findByEmail(email);
    if (!userExists) {
      return res.status(400).json({
        status: false,
        message: "User email not found."
      });
    }

    const newUser = await userService.update(userExists.id, {
      password: md5(newPassword)
    });
    return res.status(200).json({
      status: false,
      message: "User was updated successfully.",
      data: newUser
    });
  } catch {
    return res.status(500).json({
      status: false,
      message: "Something went wrong."
    });
  }
}

const userController = {
  getMe,
  register,
  login,
  refreshToken,
  forgotPassword,
  otp,
  resetPassword
};
module.exports = userController;