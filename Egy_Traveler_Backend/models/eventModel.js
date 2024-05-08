const mongoose = require("mongoose")
const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    latitude: {
        type: Number,
        // required: true,
    },
    longitude: {
        type: Number,
        // required: true,
    },
    location: {
        type: String,
        required: true,
    },
    highlights: [
        {
            type: String,
        },
    ],
    startAt: {
        type: Date,
        required: true,
    },
    endAt: {
        type: Date,
        required: true,
    },
})

const Event = mongoose.model("Event", EventSchema)

module.exports = Event
