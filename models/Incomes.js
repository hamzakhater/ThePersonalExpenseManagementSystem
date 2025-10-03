const { dbConnection } = require("../configurations");
const { IncomeValidator } = require("../validators");

class Incomes {
  constructor(incomesData) {
    this.incomesData = incomesData;
  }
  save(cb) {
    dbConnection("Incomes", async (collection) => {
      try {
        await collection.insertOne(this.incomesData);
        cb({
          status: true,
        });
      } catch (err) {
        cb({
          status: false,
          message: err.message,
        });
      }
    });
  }

  static validate(incomesData) {
    const validation = IncomeValidator.validate(incomesData);
    return validation;
  }

  static remaining(_user_id) {
    return new Promise((resolve, reject) => {
      dbConnection("Incomes", async (collection) => {
        try {
          const incomes = await collection.findOne({ _user_id });
          if (!incomes) {
            const error = new Error("Wrong or not found Incomes");
            error.statusCode = 401;
            reject(error);
          }
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth();
          const start = new Date(year, month, 1);
          const end = new Date(year, month + 1, 1);
          const monthlyincome = incomes.MonthlyIncome;
          dbConnection("Expenses", async (collection) => {
            const expenses = await collection
              .find({
                $and: [
                  { _user_id: _user_id },
                  { date: { $gte: start, $lt: end } },
                ],
              })
              .toArray();
            if (!expenses || expenses.length === 0) {
              const error = new Error("Wrong or not found Expenses");
              error.statusCode = 401;
              resolve(error);
            }
            const count = expenses.length;
            let sum = 0;
            for (let i = 0; i < count; i++) {
              if (expenses[i].amount) {
                sum += expenses[i].amount;
              }
            }
            const remaining = monthlyincome - sum;
            resolve({
              RemainingMonthlyIncome: remaining,
            });
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = Incomes;
