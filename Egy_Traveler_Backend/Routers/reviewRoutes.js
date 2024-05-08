const express = require("express")
const reviewController = require("../Controllers/reviewController")
const authController = require("../Controllers/authController")
const { auth } = require("../validators/tokenChecker")

const router = express.Router({ mergeParams: true })

router.route("/:id").post(auth, reviewController.createReview)

// router
//     .route("/:reviewId")
//     .get(reviewController.getReview)
//     .patch(authController.protect, authController.restrictTo("user"), reviewController.updateReview)
//     .delete(authController.protect, authController.restrictTo("user"), reviewController.deleteReview)

module.exports = router
