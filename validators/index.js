const userValidator = require('./user')
const IncomeValidator = require('./income')
const ExpensesValidator = require('./expenses')

module.exports = {
    userValidator: userValidator.signupschema,
    loginValidator: userValidator.loginSchema,
    IncomeValidator:IncomeValidator.IncomeSchema,
    ExpensesValidator:ExpensesValidator.ExpensesSchema
}