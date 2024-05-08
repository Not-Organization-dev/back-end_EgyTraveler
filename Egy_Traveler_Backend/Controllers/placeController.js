const Place = require("../models/placeModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const exportIdfromToken = (e) => {
    const token = e.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    return decodedToken.id
}

const ratingCalculator = (ratings) => {
    let sum = 0
    for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i]
    }
    return sum / ratings.length
}

// Create a

exports.createPlace = catchAsync(async (req, res, next) => {
    req.body.language = req.query.lang || "en"
    const placescounter = await Place.find()

    const ids = placescounter.map((place) => place.id)
    let newId = 1
    while (ids.includes(newId)) {
        newId++
    }
    req.body.id = newId

    const newPlace = await Place.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            Place: newPlace,
        },
    })
})

exports.getAllPlaces = catchAsync(async (req, res, next) => {
    const limit = req.query.limit * 1 || 20
    const page = req.query.page * 1 || 1
    const skip = (page - 1) * limit
    const language = req.query.lang || "en"

    const places = await Place.find({ language }).populate("category").limit(limit).skip(skip)
    const doncumentCount = await Place.find({ language }).countDocuments()

    res.status(200).json({
        status: "success",
        results: places.length,
        page,
        totalPages: Math.ceil(doncumentCount / limit),
        data: {
            places,
        },
    })
})
exports.getAllPlacesRecommend = catchAsync(async (req, res, next) => {
    const language = req.query.lang || "en"
    const places = await Place.find({ language }).populate("category")

    res.status(200).json({
        status: "success",
        results: places.length,
        data: {
            places,
        },
    })
})

exports.getPlace = catchAsync(async (req, res, next) => {
    let place = await Place.findById(req.params.id).populate("reviews category")
    let user
    let isFavorite = false
    let isTrip = false
    if (!place) {
        return next(new AppError("No Place found with that ID", 404))
    }
    if (req.headers.authorization != undefined || req.headers.authorization != null) {
        if (req.headers.authorization.length > 15) {
            const userId = exportIdfromToken(req.headers.authorization)
            user = await User.findById(userId)
            if (user.favoritePlaces.includes(place._id)) {
                isFavorite = true
            }
            if (user.userTrips.includes(place._id)) {
                isTrip = true
            }
        }
    }

    place = { ...place.toObject(), isFavorite, isTrip }

    // place.rating = ratingCalculator(place.reviews.map((review) => review.rating))

    // await place.save()

    res.status(200).json({
        status: "success",
        data: {
            place,
        },
    })
})

exports.updatePlace = catchAsync(async (req, res, next) => {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!place) {
        return next(new AppError("No Place found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            place,
        },
    })
})

exports.deletePlace = catchAsync(async (req, res, next) => {
    const place = await Place.findByIdAndDelete(req.params.id)

    if (!place) {
        return next(new AppError("No Place found with that ID", 404))
    }

    res.status(204).json({
        status: "success",
        data: null,
    })
})

exports.searchPlaces = catchAsync(async (req, res, next) => {
    //add search by category
    const filter = req.query.category
        ? {
              $or: [
                  {
                      name: {
                          $regex: req.query.search,
                          $options: "i",
                      },
                  },
                  {
                      description: {
                          $regex: req.query.search,
                          $options: "i",
                      },
                  },
              ],
              $and: [
                  {
                      category: req.query.category,
                  },
              ],
          }
        : {
              $or: [
                  {
                      name: {
                          $regex: req.query.search,
                          $options: "i",
                      },
                  },
                  {
                      description: {
                          $regex: req.query.search,
                          $options: "i",
                      },
                  },
              ],
          }
    // console.log(filter)
    const places = await Place.find().where(filter)

    res.status(200).json({
        status: "success",
        results: places.length,
        data: {
            places,
        },
    })
})

exports.getRecomedationByRating = catchAsync(async (req, res, next) => {
    const language = req.query.lang || "en"
    const places = await Place.find({language}).sort({ rating: -1 }).limit(5)

    res.status(200).json({
        status: "success",
        results: places.length,
        data: {
            places,
        },
    })
})

exports.addFavoritePlace = catchAsync(async (req, res, next) => {
    // const user = req.user
    // const place = req.params.id
    const place = await Place.findById(req.params.id)
    if (!place) {
        return next(new AppError("No Place found with that ID", 404))
    }
    // i want to add the req.params.id once cant be repeated
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { favoritePlaces: req.params.id },
        },
        {
            new: true,
        }
    )
    // console.log(place);

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})

exports.removeFavoritePlace = catchAsync(async (req, res, next) => {
    const place = req.params.id
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { favoritePlaces: place },
        },
        {
            new: true,
        }
    )

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})

exports.getFavoritePlaces = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("favoritePlaces favoriteArticles userTrips")

    res.status(200).json({
        status: "success",
        data: {
            favoritePlaces: user.favoritePlaces,
            favoriteArticles: user.favoriteArticles,
            userTrips: user.userTrips,
        },
    })
})

exports.addUserTrips = catchAsync(async (req, res, next) => {
    // const user = req.user
    // const place = req.params.id
    const place = await Place.findById(req.params.id)
    if (!place) {
        return next(new AppError("No Place found with that ID", 404))
    }
    // i want to add the req.params.id once cant be repeated
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { userTrips: req.params.id },
        },
        {
            new: true,
        }
    )
    // console.log(place);

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})

exports.removeUserTrips = catchAsync(async (req, res, next) => {
    const place = req.params.id
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { userTrips: place },
        },
        {
            new: true,
        }
    )

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})

// exports.getUserTrips = catchAsync(async (req, res, next) => {
//     const user = await User.findById(req.user._id).populate("favoritePlaces favoriteArticles userTrips")

//     res.status(200).json({
//         status: "success",
//         data: {
//             favoritePlaces: user.favoritePlaces,
//             favoriteArticles: user.favoriteArticles,
//             userTrips: user.userTrips,
//         },
//     })
// })
