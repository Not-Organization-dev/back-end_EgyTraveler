const mongoose = require("mongoose")

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        enum: ["en", "ar"],
        default: "en",
    },
    image: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        // required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    longitude: {
        type: Number,
        // required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    highlights: [
        {
            type: String,
        },
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    id: {
        type: Number,
        default: 0,
    },
})

//placeSchema.plugin(AutoIncrement, { inc_field: "id", disable_hooks: true })

const Place = mongoose.model("Place", placeSchema)

module.exports = Place
