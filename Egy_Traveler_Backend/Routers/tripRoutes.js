const express = require("express")
const router = express.Router()
const tripController = require("../Controllers/tripController")
const { auth, allowTo } = require("../validators/tokenChecker")
const { uploadIMG } = require("../utils/cloudinary")
const upload = require("../utils/multer")
const { createTripValidator } = require("../validators/tripValidator")

router
    .route("/")
    .get(tripController.getAllTrips)
    .post(auth, allowTo("admin"), upload.single("image"), createTripValidator, uploadIMG, tripController.createTrip)

router
    .route("/place/:id")
    .get(tripController.getPlaceinsideTrip)
    .put(auth, allowTo("admin"),upload.single("image"), uploadIMG, tripController.addPlaceinsideTrip)
    .delete(auth, allowTo("admin"), tripController.deletePlaceInsideTrip)

router
    .route("/:id")
    .get(tripController.getTrip)
    .put(auth, allowTo("admin"), upload.single("image"), uploadIMG, tripController.updateTrip)
    .delete(auth, allowTo("admin"), tripController.deleteTrip)

module.exports = router
