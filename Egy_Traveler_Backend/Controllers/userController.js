const User = require("../models/userModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

// edit profile
exports.editProfile = catchAsync(async (req, res, next) => {
    const { name, preferences, address } = req.body
    if (req.body.image) {
        req.body.avatar = req.body.image
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            name,
            preferences,
            avatar: req.body.avatar,
            address,
        },
        {
            new: true,
            runValidators: true,
        }
    )

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})

// change password
exports.changePassword = catchAsync(async (req, res, next) => {
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new AppError("Passwords do not match", 400))
    }
    const user = await User.findById(req.user.id).select("+password")

    if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
        return next(new AppError("Your current password is incorrect", 401))
    }

    user.password = req.body.newPassword
    await user.save()

    res.status(200).json({
        status: "success",
        message: "Password changed successfully",
    })
})

// delete account
exports.deleteAccount = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password")

    if (!(await user.comparePassword(req.body.password, user.password))) {
        return next(new AppError("Your current password is incorrect", 401))
    }

    await User.findByIdAndDelete(req.user.id)

    res.status(200).json({
        status: "success",
        message: "Account deleted successfully",
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})
