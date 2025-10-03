const { User } = require("../models");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");

const signup = async (req, res, next) => {
  const userData = req.body;

  // التحقق من صحة البيانات
  const validation = User.validate(userData);
  if (validation.error) {
    return next(createError(400, validation.error.message));
  }

  const user = new User(userData);

  try {
    // التحقق من وجود المستخدم مسبقًا
    const result = await user.isExist();
    if (result.check) {
      return next(createError(409, result.message));
    }

    // حفظ المستخدم
    user.save((status) => {
      if (status.status) {
        return returnJson(
          res,
          201,
          true,
          "User has been created successfully",
          null
        );
      } else {
        return next(createError(500, status.message));
      }
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

const login = async (req, res, next) => {
  try {
    const result = await User.login(req.body);

    if (result instanceof Error) {
      return next(createError(result.statusCode, result.message));
    }

    const secretKey = readFileSync("./configurations/private.key");
    const token = jwt.sign({ _user_id: result.data._id }, secretKey);

    return returnJson(res, 200, true, "Logged in successfully", token);
  } catch (err) {
    next(createError(err.statusCode || 500, err.message));
  }
};

module.exports = {
  signup,
  login,
};
