const mongoose = require("mongoose")

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // unique: true,
    },
    description: {
        type: String,
        // required: true,
    },
    image: {
        type: String,
        // required: true,
    },
    startAt: {
        type: Date,
        // required: true,
    },
    endAt: {
        type: Date,
        // required: true,
    },

    latitude: {
        type: Number,
        // required: true,
    },
    longitude: {
        type: Number,
        // required: true,
    },
})

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        // required: true,
    },
    longitude: {
        type: Number,
        // required: true,
    },
    places: [placeSchema],
    rating: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
})

const Trip = mongoose.model("Trip", tripSchema)

module.exports = Trip

// const TripPlace = mongoose.model("TripPlace", placeSchema)

// module.exports = TripPlace
