const { check } = require("express-validator")
const validatorMiddleware = require("../middlewares/validatorMiddleware")
const User = require("../models/userModel")

exports.signupValidator = [
    check("name").notEmpty().withMessage("Please Enter you name").isLength({ min: 3 }).withMessage("Too short name"),

    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                  return Promise.reject(new Error("E-mail already in use"))
                }
            })
        ),

    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
              return Promise.reject(new Error("Passwords don't match"))
            }
            return true
        }),

    check("passwordConfirm").notEmpty().withMessage("Password confirmation required"),

    validatorMiddleware,
]

exports.loginValidator = [
    check("email").notEmpty().withMessage("Email required").isEmail().withMessage("Invalid email address"),

    check("password").notEmpty().withMessage("Password required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    validatorMiddleware,
]
