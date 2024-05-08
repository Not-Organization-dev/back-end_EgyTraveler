
const { check } = require("express-validator")
const validatorMiddleware = require("../middlewares/validatorMiddleware")

exports.createPlaceValidator = [
    check("name").notEmpty().withMessage("Name required"),
    check("description").notEmpty().withMessage("Description required"),
    check("location").notEmpty().withMessage("Location required"),
    // check("image").isString().notEmpty().withMessage("Image required"),
    validatorMiddleware,
]
