const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const jwt = require("jsonwebtoken")
const sendEmail = require("../config/emailSends")

const sendPassword = async (user) => {
    // Generate and set the OTP

    try {
        // Save the user without validation (if needed)

        // Compose the email message
        const message = `<div class="container">
        <h2>Password Reset Code</h2>
        <p>Dear ${user.name},</p>
        <p>
            We received a request to reset your EgyTravelers account password. To proceed with the password reset, please enter the following one-time verification code:
        </p>
        <p><strong>Verification Code:</strong> ${user.passwordResetToken}</p>
        <p><strong>Note:</strong> Please use this code within the next 10 minutes to ensure the security of your account.</p>
        <p>If you didn't request this code or have any concerns, please contact our support team immediately.</p>
        <p>Thank you for your cooperation.</p>
        <p>Best regards,</p>
        <p><strong>[EgyTravelers]</strong></p>
    </div>`

        // Send the email
        await sendEmail({
            email: user.email,
            subject: `Password Reset Code`,
            message,
        })
        // Log a success message
    } catch (err) {
        // Handle any errors
        console.error("Error in forget password code:", err)
    }
}

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    })
}

//signin and signup
exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body

    const newUser = await User.create({
        name,
        email,
        password,
    })

    createSendToken(newUser, 201, res)
})

exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email }).select("+password")

    // Compare the provided password with the hashed password
    if (!user || !(await user.comparePassword(password, user.password))) {
        // instance method
        return next(new AppError("Incorrect email or password", 401)) //401
    }

    createSendToken(user, 200, res)
})

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body

    let finalUser = await User.findOne({ email })
    if (!finalUser) {
        return next(new AppError("Email dose not found", 404))
    }

    const user = await User.findOneAndUpdate(
        { email },
        { passwordResetToken: Math.floor(1000 + Math.random() * 9000).toString(), passwordResetExpires: Date.now() + 10 * 60 * 1000 },
        { new: true }
    )

    finalUser = await User.findOne({ email })

    sendPassword(finalUser)
    res.status(200).json({
        status: "success",
        message: "If you provided a valid email, message sent to your mail",
    })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { email, password, passwordConfirm, forgetCode } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return next(new AppError("Email dose not found", 404))
    }
    if (forgetCode != user.passwordResetToken) {
        return next(new AppError("Invalid token", 403))
    }

    if (!user.passwordResetExpires) {
        return next(new AppError("Invalid or expired token", 400))
    }

    if (Date.now() > user.passwordResetExpires) {
        user.passwordResetExpires = null
        await user.save({ validateBeforeSave: false })
        return next(new AppError("Invalid or expired token", 400))
    }
    if (password.length < 8) {
        return next(new AppError("Passwords too short", 400))
    }
    if (password !== passwordConfirm) {
        return next(new AppError("Passwords do not match", 400))
    }

    user.password = password
    user.passwordResetExpires = null
    user.passwordResetToken = null
    await user.save({ validateBeforeSave: false })
    res.status(201).json({
        status: "success",
        message: "Your password has been updated successfully",
    })
})
