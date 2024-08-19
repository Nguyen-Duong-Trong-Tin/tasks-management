const express = require("express");
const router = express.Router();

const Task = require("../../../models/task.model");

router.get('/', async (req, res) => {
  const records = await Task.find({
    deleted: false
  });

  res.json(records);
});

router.get('/detail/:id', async (req, res) => {
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

module.exports = router;