const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    expires: 180
  }
}, {
  timestamps: true
});

const ForgotPasswordModel = mongoose.model("ForgotPasswordModel", ForgotPasswordSchema, "forgot_passwords");
module.exports = ForgotPasswordModel;