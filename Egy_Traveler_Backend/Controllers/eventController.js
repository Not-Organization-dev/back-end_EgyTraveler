const Event = require("../models/eventModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.createEvent = catchAsync(async (req, res) => {
    const newEvent = await Event.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            Event: newEvent,
        },
    })
})

exports.getAllEvents = catchAsync(async (req, res, next) => {
    const events = await Event.find()

    res.status(200).json({
        status: "success",
        results: events.length,
        data: {
            events,
        },
    })
})

exports.getEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id)

    if (!event) {
        return next(new AppError("No Event found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            event,
        },
    })
})

exports.updateEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!event) {
        return next(new AppError("No Event found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            event,
        },
    })
})

exports.deleteEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
        return next(new AppError("No Event found with that ID", 404))
    }

    res.status(204).json({})
})
