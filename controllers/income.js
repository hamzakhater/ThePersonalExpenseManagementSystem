const { Incomes } = require("../models");
const createError = require("http-errors");
const { ObjectId } = require("bson");

const Enterincomes = (req, res, next) => {
  const incomeData = req.body;
  _user_id = req._user_id;
  incomeData._user_id = _user_id;
  const validation = Incomes.validate(incomeData);
  if (validation.error) {
    const error = createError(400, validation.error.message);
    next(error);
    return;
  }

  const income = new Incomes(incomeData);
  income.incomesData._user_id = new ObjectId(income.incomesData._user_id);
  income.incomesData.MonthlyIncome = parseInt(incomeData.MonthlyIncome);

  income.save((status) => {
    if (status.status) {
      return returnJson(
        res,
        201,
        true,
        "incomedata has been created successfully",
        null
      );
    } else {
      next(createError(500, status.message));
      return;
    }
  });
};

const getremaining = (req, res, next) => {
  _user_id = new ObjectId(req._user_id);
  Incomes.remaining(_user_id)
    .then((result) => {
      if (result instanceof Error) {
        next(createError(result.statusCode, result.message));
      } else {
        return returnJson(
          res,
          200,
          true,
          "the remaining income of the  month",
          result
        );
      }
    })
    .catch((err) => {
      next(createError(err.statusCode, err.message));
    });
};

module.exports = {
  Enterincomes,
  getremaining,
};
