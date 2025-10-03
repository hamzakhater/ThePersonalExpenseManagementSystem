const { Router } = require("express");
const { incomeController } = require("../controllers");
const { auth } = require("../middlewares");

const router = Router();

router
  .post("/add", auth, incomeController.Enterincomes)
  .get("/getremaining", auth, incomeController.getremaining);

module.exports = router;
