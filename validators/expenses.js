const Joi = require('@hapi/joi');


const ExpensesSchema = Joi.object({
    _user_id: Joi.string().required(),
    category: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    date:Joi.date().default(Date.now).required()
})



module.exports = {
    ExpensesSchema
};