const express = require("express")
const eventController = require("../Controllers/eventController")
const { auth, allowTo } = require("../validators/tokenChecker")
const { uploadIMG, uploadImages } = require("../utils/cloudinary")
const upload = require("../utils/multer")
const { createEventValidator } = require("../validators/eventValidator")

const router = express.Router()

router
    .route("/")
    .get(eventController.getAllEvents)
    .post(auth, allowTo("admin"), upload.array("images"), createEventValidator, uploadImages, eventController.createEvent)

router
    .route("/:id")
    .get(eventController.getEvent)
    .put(auth, allowTo("admin"), upload.array("images"), uploadImages, eventController.updateEvent)
    .delete(auth, allowTo("admin"), eventController.deleteEvent)

module.exports = router
