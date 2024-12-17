const UserModel = require("../models/user.model");

const find = async () => {
  const users = await UserModel
    .find({
      deleted: false
    })
    .select("-password");
  return users;
}

const findById = async (id) => {
  const user = await UserModel
    .findOne({
      _id: id,
      deleted: false
    })
    .select("-password");
  return user;
}

const findByEmail = async (email) => {
  const user = await UserModel
    .findOne({
      email: email,
      deleted: false
    })
    .select("-password");
  return user;
}

const create = async (user) => {
  const newUser = new UserModel(user);
  await newUser.save();

  const userExists = await UserModel
    .findOne({
      _id: newUser.id
    }).select("-password");
  return userExists;
}

const login = async (email, password) => {
  const user = await UserModel
    .findOne({
      email: email,
      password: password,
      deleted: false
    })
    .select("-password");
  return user;
}

const update = async (id, user) => {
  const newUser = await UserModel
    .findOneAndUpdate({
      _id: id
    }, user, {
      new: true
    })
    .select("-password");
  return newUser;
}

const userService = {
  find,
  findById,
  findByEmail,
  create,
  login,
  update
};
module.exports = userService;