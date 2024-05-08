const express = require("express")
const router = express.Router()
const authController = require("../Controllers/authController")
const { signupValidator, loginValidator } = require("../validators/authValidator")

router.post("/signup", signupValidator, authController.signup)
router.post("/signin", loginValidator, authController.signin)


module.exports = router
