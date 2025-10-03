const { dbConnection } = require("../configurations");
const { userValidator, loginValidator } = require("../validators");
const { hashSync, compareSync } = require("bcryptjs");

class User {
  constructor(userData) {
    this.userData = userData;
  }

  save(cb) {
    dbConnection("users", async (collection) => {
      try {
        const hashedPassword = hashSync(this.userData.password, 12);
        this.userData.password = hashedPassword;
        await collection.insertOne(this.userData);
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

  isExist() {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (collection) => {
        try {
          const user = await collection.findOne({
            $or: [
              { username: this.userData.username },
              { email: this.userData.email },
            ],
          });

          if (!user) {
            resolve({
              check: false,
            });
          } else {
            if (user.email === this.userData.email) {
              resolve({
                check: true,
                message: "The email is already used",
              });
              return;
            } else if (user.username === this.userData.username) {
              resolve({
                check: true,
                message: "The username is already used",
              });
            }
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  static validate(userData) {
    try {
      const validationResult = userValidator.validate(userData);
      return validationResult;
    } catch (err) {
      return false;
    }
  }

  static login(loginData) {
    return new Promise((resolve, reject) => {
      const validation = loginValidator.validate(loginData);
      if (validation.error) {
        const error = new Error(validation.error.message);
        error.statusCode = 400;
        resolve(error);
      }

      dbConnection("users", async (collection) => {
        try {
          const user = await collection.findOne({
            username: loginData.username,
          });

          if (!user || !compareSync(loginData.password, user.password)) {
            const error = new Error("Wrong or not found username or password");
            error.statusCode = 401;
            resolve(error);
          } else {
            resolve({
              status: true,
              data: user,
            });
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

module.exports = User;
