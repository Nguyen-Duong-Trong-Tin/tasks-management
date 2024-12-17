const taskRoutes = require("./task.route");
const taskDetailRoutes = require("./taskDetail.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
  const prefix = "/api/v1";

  app.use(prefix + "/tasks", taskRoutes);
  app.use(prefix + "/task-details", taskDetailRoutes);
  app.use(prefix + "/users", userRoutes);
}