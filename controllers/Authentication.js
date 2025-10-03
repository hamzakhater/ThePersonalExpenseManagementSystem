const { User} = require('../models')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const {readFileSync} = require('fs')



const signup = (req, res, next) => {
    const userData = req.body;
    const validation = User.validate(userData)
    if (validation.error) {
        const error = createError(400, validation.error.message)
        next(error)
        return
    }

    const user = new User(userData);
    
    user.isExist()
        .then(result => {
            if (result.check) {
                next(createError(409, result.message))
                return
            }
        })
        .catch(err => {
            next(createError(500, err.message))
            return
        })

    user.save((status) => {
        if (status.status) {
            return returnJson(res, 201, true, "User has been created successfully",null)
                 
        } else{
            next(createError(500, status.message))
            return
        }
                        
    })
    }
const login = (req, res, next) =>{
    User.login(req.body)
        .then(result => {
            if (result instanceof Error) {
                next(createError(result.statusCode, result.message))
                return
            }

            const secretKey = readFileSync('./configurations/private.key')
            const token = jwt.sign(
                {
                    _user_id: result.data._id
                }, secretKey
            )
            return returnJson(res, 200, true, "Logged in successfully",token)
        })
        .catch(err => {
            next(createError(err.statusCode, err.message))
            return
        })
}

module.exports = {
    signup,
    login
}