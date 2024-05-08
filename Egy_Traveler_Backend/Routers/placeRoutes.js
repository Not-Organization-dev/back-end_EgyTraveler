const express = require("express")
const router = express.Router()
const placeController = require("../Controllers/placeController")
const { auth, allowTo } = require("../validators/tokenChecker")
const { uploadIMG } = require("../utils/cloudinary")
const upload = require("../utils/multer")
const { createPlaceValidator } = require("../validators/placeValidator")

router
    .route("/")
    .get(placeController.getAllPlaces)
    .post(auth, allowTo("admin"), upload.single("image"), createPlaceValidator, uploadIMG, placeController.createPlace)
router.route("/search").get(placeController.searchPlaces)

router.route("/all-places").get(placeController.getAllPlacesRecommend)

router.route("/recomended").get(placeController.getRecomedationByRating)

router
    .route("/:id")
    .get(placeController.getPlace)
    .put(auth, allowTo("admin"), upload.single("image"), uploadIMG, placeController.updatePlace)
    .delete(auth, allowTo("admin"), placeController.deletePlace)

router.route("/favorite/:id").put(auth, placeController.addFavoritePlace).delete(auth, placeController.removeFavoritePlace)
router.route("/usertips/:id").put(auth, placeController.addUserTrips).delete(auth, placeController.removeUserTrips)

module.exports = router
