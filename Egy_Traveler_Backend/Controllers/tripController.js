const Trip = require("../models/tripsModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const TripPlace = require("../models/tripsModel")

exports.createTrip = catchAsync(async (req, res, next) => {
    console.log(req.body.image)
    const newTrip = await Trip.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            Trip: newTrip,
        },
    })
})

exports.getAllTrips = catchAsync(async (req, res, next) => {
    const trips = await Trip.find()

    res.status(200).json({
        status: "success",
        results: trips.length,
        data: {
            trips,
        },
    })
})

exports.getTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findById(req.params.id)

    if (!trip) {
        return next(new AppError("No Trip found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            trip,
        },
    })
})

exports.updateTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!trip) {
        return next(new AppError("No Trip found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            trip,
        },
    })
})

exports.deleteTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findByIdAndDelete(req.params.id)

    if (!trip) {
        return next(new AppError("No Trip found with that ID", 404))
    }

    res.status(204).json({})
})

exports.getPlaceinsideTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findById(req.params.id)
    if (!trip) {
        return next(new AppError("No Trip found with that ID", 404))
    }
    const placeId = req.query.placeid

    //get the trip.places that equal to placeId
    const place = trip.places.find((el) => el.id === placeId)

    if (!place) {
        return next(new AppError("No place found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: place,
    })
})

exports.addPlaceinsideTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findById(req.params.id)

    const place = await Trip.findByIdAndUpdate(req.params.id, {
        places: [...trip.places, req.body],
    })

    res.status(200).json({
        status: "success",
        message: "Place added successfully",
    })
})

exports.deletePlaceInsideTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findById(req.params.id)
    const done = await Trip.findByIdAndUpdate(req.params.id, {
        places: trip.places.filter((el) => el.id !== req.query.placeid),
    })

    res.status(200).json({
        status: "success",
        message: "Place deleted successfully",
    })
})
