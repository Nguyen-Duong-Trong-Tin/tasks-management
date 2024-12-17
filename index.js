const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser()); 

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const env = require("dotenv");
env.config();

const database = require("./configs/database.config");
database();

const routeVersion1 = require("./apis/v1/routes/index.route");
routeVersion1(app);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});