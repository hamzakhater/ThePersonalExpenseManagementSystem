const { Router } = require('express')
const { expensesController } = require('../controllers')
const {auth} = require('../middlewares')


const router = Router()

router.post('/add',auth,expensesController.addexpenses)
       .get('/get',auth,expensesController.getExpenses)
       .get('/getTotol',auth,expensesController.getTotol)
       .get('/getAverage',auth,expensesController.getAverage)
       .get('/getTypesexpenses',auth,expensesController.getTypesexpenses)
       

module.exports = router;