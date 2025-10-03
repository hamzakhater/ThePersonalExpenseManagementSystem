const authRouter = require("./Authentication");
const incomeRouter = require("./income");
const expensesRouter = require("./expenses");

module.exports = (app) => {
  app.use("/Authentication", authRouter),
    app.use("/Incomes", incomeRouter),
    app.use("/Expenses", expensesRouter);
};
