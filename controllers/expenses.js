const {Expenses} = require('../models')
const createError = require('http-errors')
const {ObjectId} = require("bson");


const addexpenses = (req, res, next) => {
    const expensesData = req.body;
    _user_id = req._user_id
    expensesData._user_id=_user_id
     
    
    const validation = Expenses.validate(expensesData)
    if (validation.error) {
        const error = createError(400, validation.error.message)
        next(error)
        return
    } 
    const category=expensesData.category
    if(!(category==='Food'||category==='Transportation'
        ||category==='Healthcare'||category==='Rent')){
            return returnJson(res, 400, false, "Error in entering the type of expense",null)
    }

   
    const expenses = new Expenses(expensesData);
    expenses.expensesData._user_id= new ObjectId(expenses.expensesData._user_id);
    expenses.expensesData.date=new Date(expensesData.date);
    expenses.expensesData.amount=parseInt(expensesData.amount)
    expenses.save((status) => {
        if (status.status) {
            return returnJson(res, 201, true, "expenses data has been created successfully",null)
        } else {
            next(createError(500, status.message))
            return
        }
    });
}


const getExpenses = (req, res, next) => {
    _user_id = req._user_id;
    _user_id = new ObjectId(_user_id);
    Expenses.get(_user_id)
             .then(result =>{
               if (result instanceof Error) {
                       next(createError(result.statusCode, result.message))
                   } else{
           return returnJson(res,200,true,"Expenses for the current month retrieved successfuly",result.data)

                   }
         })
         .catch(err => {
            next(createError(err.statusCode, err.message))
        })
}

const getTotol = (req, res, next) =>{
    _user_id = new ObjectId(req._user_id);
    Expenses.totol(_user_id)
             .then(result =>{
               if (result instanceof Error) {
                       next(createError(result.statusCode, result.message))
                   }else{
                    return returnJson(res,200,true,"the totol expenses of month",result)
                   }
         })
         .catch(err => {
            next(createError(err.statusCode, err.message))
        })
}

const getAverage = (req, res, next) => {
    _user_id = new ObjectId(req._user_id);
    Expenses.ave(_user_id)
             .then(result =>{
               if (result instanceof Error) {
                       next(createError(result.statusCode, result.message))
                   }else{
                    return returnJson(res,200,true,"the Average deily expenses",result)
                   }
         })
         .catch(err => {
            next(createError(err.statusCode, err.message))
        })
}
const getTypesexpenses = (req, res, next) => {
    _user_id = new ObjectId(req._user_id);
    Expenses.getexpenses(_user_id)
             .then(result =>{
               if (result instanceof Error) {
                       next(createError(result.statusCode, result.message))
                   } else {
                    return returnJson(res,200,true,"the Total types of expenses",result.date)
                   }
         })
         .catch(err => {
            next(createError(err.statusCode, err.message))
        })
}



module.exports = {
    addexpenses,
    getExpenses,
    getTotol,
    getAverage,
    getTypesexpenses
}
