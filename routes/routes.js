const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const authController = require("../controllers/authController");

/* GET home page. */
router.get("/", indexController.index);

/* GET Sign Up */
router.get("/sign-up", authController.sign_up_get);
/* POST Sign Up */
router.post("/sign-up", authController.sign_up_post);

module.exports = router;
