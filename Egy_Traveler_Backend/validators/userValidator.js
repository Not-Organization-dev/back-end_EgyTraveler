const { check } = require("express-validator")
const validatorMiddleware = require("../middlewares/validatorMiddleware")
const User = require("../models/userModel")

exports.editProfileValidator = [
    check("name").notEmpty().withMessage("Please Enter you name").isLength({ min: 3 }).withMessage("Too short name"),

    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("E-mail already in use "))
                }
            })
        ),

    check("address").notEmpty().withMessage("Address required").isLength({ min: 10 }).withMessage("Too short address"),

    validatorMiddleware,
]

exports.changePasswordValidator = [
    check("currentPassword")
        .notEmpty()
        .withMessage("Current password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 8 characters"),

    check("newPassword").notEmpty().withMessage("New password required").isLength({ min: 6 }).withMessage("Password must be at least 8 characters"),

    check("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password required")
        .custom((password, { req }) => {
            if (password !== req.body.newPassword) {
                throw new Error("Passwords do not match")
            }
            return true
        }),

    validatorMiddleware,
]

exports.deleteAccountValidator = [
    check("password").notEmpty().withMessage("Password required").isLength({ min: 6 }).withMessage("Password must be at least 8 characters"),

    validatorMiddleware,
]
