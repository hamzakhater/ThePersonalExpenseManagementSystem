const Joi = require('@hapi/joi')

const IncomeSchema = Joi.object({
    _user_id: Joi.string().required(),
    MonthlyIncome: Joi.number().required(),
    comment: Joi.string().required()
})



module.exports = {
    IncomeSchema
};