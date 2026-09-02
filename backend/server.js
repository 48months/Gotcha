const express = require("express");
const app = express();
require("dotenv").config();
const logger = require("./utility/logger");
const bodyParser = require("body-parser");
const router = require("./routes/routes");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("strictQuery", false);
mongoose.connection.on("error", (err) => {
  logger.error(__filename, "connection error to DB !!! " + err);
});

mongoose.connection.on("connected", (err, res) => {
  logger.info(__filename, "Connection successful to DB !!! ");
});

app.use(bodyParser.json());
app.use(router);

app.listen(process.env.PORT, () => {
  logger.info(__filename, "Server started on port " + process.env.PORT);
});
