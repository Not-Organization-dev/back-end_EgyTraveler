const Review = require("../models/reviewModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Place = require("../models/placeModel")

const ratingCalculator = (ratings) => {
    let sum = 0
    for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i]
    }
    return sum / ratings.length
}

//create Review
exports.createReview = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id).populate("reviews")

    if (!place) {
        return next(new AppError("No place found with that ID", 404))
    }

    const review = await Review.findOne({ place: req.params.id, user: req.user.id })

    if (review) {
        return next(new AppError("You have already reviewed this place", 400))
    }

    const newReview = await Review.create({
        rating: req.body.rating,
        user: req.user.id,
        place: req.params.id,
        comment: req.body.comment,
    })

    // const rating = place
    // rating.reviews.push(newReview)

    place.reviews.push(newReview._id)
    await place.save()

    const rating = await Place.findById(req.params.id).populate("reviews")

    rating.rating = ratingCalculator(rating.reviews.map((review) => review.rating))
    await rating.save()

    res.status(201).json({
        status: "success",
        data: {
            review: newReview,
            rating: rating.rating,
        },
    })
})

//get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id)

    if (!place) {
        return next(new AppError("No place found with that ID", 404))
    }

    const reviews = await Review.find({ place: place._id })

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews,
        },
    })
})

//get a single review
exports.getReview = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id)

    if (!place) {
        return next(new AppError("No place found with that ID", 404))
    }

    const review = await Review.findById(req.params.reviewId)

    if (!review) {
        return next(new AppError("No review found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            review,
        },
    })
})

//update a review
exports.updateReview = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id)

    if (!place) {
        return next(new AppError("No place found with that ID", 404))
    }

    const review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
        new: true,
        runValidators: true,
    })

    if (!review) {
        return next(new AppError("No review found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            review,
        },
    })
})

//delete a review
exports.deleteReview = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id)

    if (!place) {
        return next(new AppError("No place found with that ID", 404))
    }

    const review = await Review.findByIdAndDelete(req.params.reviewId)

    if (!review) {
        return next(new AppError("No review found with that ID", 404))
    }

    place.reviews.pull(review._id)
    await place.save()

    res.status(204).json({
        status: "success",
        data: null,
    })
})
