const express = require('express');
const database = require("./config/database");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

database.connect();

const Task = require("./models/task.model");

app.get('/tasks', async (req, res) => {
  const records = await Task.find({
    deleted: false
  });

  res.json(records);
});

app.get('/tasks/detail/:id', async (req, res) => {
  try {
    const record = await Task.findOne({
      _id: req.params.id,
      deleted: false
    });

    res.json(record);
  } catch (error) {
    res.json({
      code: 404
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});