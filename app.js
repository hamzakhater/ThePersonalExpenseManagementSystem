const express = require("express");
const createError = require("http-errors");
const { returnJson } = require("./my_modules");
global.returnJson = returnJson;

process.on("unhandledRejection", (reason) => {
  process.exit(1);
});

const middleware = require("./middlewares");
const routes = require("./routes");

const app = express();

middleware.global(app);

routes(app);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode).json({
    status: {
      status: false,
      message: error.message,
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
