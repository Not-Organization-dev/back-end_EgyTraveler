
const mongoose = require("mongoose")

const preferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const Preference = mongoose.model("Preference", preferenceSchema)

module.exports = Preference
