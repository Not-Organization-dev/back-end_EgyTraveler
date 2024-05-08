const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,

        unique: true,
        lowercase: true,
    },
    password: {
        type: String,

        minlength: 6,
        select: false,
    },
    address: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    preferences: [
        {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Preference",
        },
    ],
    avatar: {
        type: String,
        default: "default.jpg",
    },
    userTrips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place",
        },
    ],
    favoritePlaces: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place",
        },
    ],
    favoriteArticles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article",
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

userSchema.pre("save", async function (next) {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString()
    this.passwordResetToken = resetToken
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

const User = mongoose.model("User", userSchema)

module.exports = User
