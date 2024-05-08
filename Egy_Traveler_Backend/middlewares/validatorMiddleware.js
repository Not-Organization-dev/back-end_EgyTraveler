const { validationResult } = require("express-validator")
const AppError = require("../utils/appError")

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array()[0].msg, 400))
    }
    next()
}

module.exports = validatorMiddleware
