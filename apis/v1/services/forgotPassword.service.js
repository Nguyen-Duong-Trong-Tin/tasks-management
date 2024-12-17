const ForgotPasswordModel = require("../models/forgotPassword.model");

const findByEmailAndOTP = async (email, otp) => {
  const forgotPassword = await ForgotPasswordModel.findOne({
    email: email,
    otp: otp
  });
  return forgotPassword;
}

const create = async (forgotPassword) => {
  const newForgotPassword = new ForgotPasswordModel({
    email: forgotPassword.email,
    otp: forgotPassword.otp,
    createdAt: Date.now()
  });
  await newForgotPassword.save();
  return newForgotPassword;
}

const forgotPasswordService = {
  findByEmailAndOTP,
  create
};
module.exports = forgotPasswordService;