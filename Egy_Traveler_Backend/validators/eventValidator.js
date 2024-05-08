const { check } = require("express-validator")
const validatorMiddleware = require("../middlewares/validatorMiddleware")

exports.createEventValidator = [
    check("name").notEmpty().withMessage("Name required"),
    check("description").notEmpty().withMessage("Description required"),
    check("location").notEmpty().withMessage("Location required"),
    // check("image").isString().notEmpty().withMessage("Image required"),
    check("startAt").notEmpty().withMessage("Start date required"),
    check("endAt").notEmpty().withMessage("End date required"),
    // check("latitude").isNumeric().notEmpty().withMessage("Latitude required"),
    // check("longitude").isNumeric().notEmpty().withMessage("Longitude required"),

    validatorMiddleware,
]
