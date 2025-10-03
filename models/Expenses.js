
const { dbConnection } = require('../configurations')
const {ExpensesValidator} = require("../validators")
const {ObjectId} = require("bson");


class Expenses {
    constructor(expensesData) {
        this.expensesData = expensesData
    }
    save(cb) {
        dbConnection('Expenses', async (collection) => {
            try {
                await collection.insertOne(this.expensesData)
                cb({
                    status: true
                })
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                })
            }
        })
    }

    
   
    static get(_user_id) {
        const now =new Date();
        const year =now.getFullYear();
        const month =now.getMonth();
        const start =new Date(year,month,1);
        const end =new Date(year,month+1,1);
        return new Promise((resolve, reject) => {

            dbConnection('Expenses', async (collection) => {
                try {
                    console.log(_user_id)
                    const expenses = await collection.find({
                        '$and': [
                            {_user_id:_user_id},
                            {date: {$gte:start,$lt:end}}
                        ]

                    },
                    {projection: {_user_id: 0, _id: 0}}
                ).toArray();    
    
                    if (expenses.length === 0) {
                        const error = new Error('Wrong or not found Expenses');
                        error.statusCode = 401;
                        resolve(error);
                        return;
                    } else{
                        resolve({
                            data: expenses,
                        });
                    }
    
                 
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
    
        static totol(_user_id){
            const now =new Date();
            const year =now.getFullYear();
            const month =now.getMonth();
            const start =new Date(year,month,1);
            const end =new Date(year,month+1,1);
            return new Promise((resolve,reject) =>{
                dbConnection('Expenses', async (collection) => {
                    try {
                        const expenses = await collection.find({
                            '$and': [
                                {_user_id: _user_id},
                                {date: {$gte:start,$lt:end}}
                            ]
                        }
                        ).toArray();
                        
                        if(!expenses||expenses.length===0){
                            const error = new Error('Wrong or not found Expenses')
                            error.statusCode = 401
                            resolve(error)
                         }else{
                            const count = expenses.length
                            let sum = 0
                            for (let i = 0 ; i < count ; i++) {
                                if (expenses[i].amount) {
                                    sum += expenses[i].amount
                                }
                            }
   
                            resolve({
                               TotalMonthlyExpense: sum
                           });
                         }
                       
                    } catch (err) {
                        reject(err)
                    }
                })
            })
        }
       

        static ave(_user_id){
            const now =new Date();
            const year =now.getFullYear();
            const month =now.getMonth();
            const start =new Date(year,month,1);
            const end =new Date(year,month+1,1);
            return new Promise((resolve,reject) =>{
                dbConnection('Expenses', async (collection) => {
                    try {
                        const expenses = await collection.find({
                            '$and': [
                                {_user_id: _user_id},
                                {date: {$gte:start,$lt:end}}
                            ]
                        }
                        ).toArray();
                        
                        if(!expenses||expenses.length===0){
                            const error = new Error('Wrong or not found Expenses')
                            error.statusCode = 401
                            resolve(error)
                         }else{
                            const count = expenses.length
                            let sum = 0
                            for (let i = 0 ; i < count ; i++) {
                                if (expenses[i].amount) {
                                    sum += expenses[i].amount
                                }
                            }
                              const avg = sum / count
                            resolve({
                               AverageDailyExpense: avg
                           });
                         }
                     
                    } catch (err) {
                        reject(err)
                    }
                })
            })

          
               
        }

        static getexpenses(_user_id) {
            const now =new Date();
            const year =now.getFullYear();
            const month =now.getMonth();
            const start =new Date(year,month,1);
            const end =new Date(year,month+1,1);
            return new Promise((resolve, reject) => {
                dbConnection('Expenses', async (collection) => {
                    try {
                        const expenses = await collection.aggregate([
                            {
                                $match:{
                                    '$and': [
                                        {"_user_id": new ObjectId(_user_id)},
                                        {date: {$gte:start,$lt:end}}
                                    ]
                                }
                              },
                           {

                            $group:{
                                _id : "$category",
                                TotolAmount:{$sum: "$amount"}
                            }
                          }
                        ]).toArray();
                        if (expenses.length === 0) {
                            const error = new Error('Wrong or not found Expenses');
                            error.statusCode = 401;
                            return resolve(error);
                          
                        } else{
                            resolve({
                                date :expenses
                           });
                        }
        
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }


        


    static validate(expensesData) {
        const validation = ExpensesValidator.validate(expensesData)
        return validation
    }



}

module.exports = Expenses




   
     


