const { default: mongoose } = require("mongoose")

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    hint: {
        type: String,
    },
    when: {
        type: String,
    },
    decription: [
        {
            type: String,
        },
    ],
})

module.exports = mongoose.model("Article", articleSchema)
