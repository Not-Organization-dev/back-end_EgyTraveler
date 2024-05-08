const Article = require("../models/articleModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const exportIdfromToken = (e) => {
    const token = e.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    return decodedToken.id
}

exports.createArticle = catchAsync(async (req, res, next) => {
    const newArticle = await Article.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            Article: newArticle,
        },
    })
})

exports.getAllArticles = catchAsync(async (req, res, next) => {
    const articles = await Article.find()

    res.status(200).json({
        status: "success",
        results: articles.length,
        data: {
            articles,
        },
    })
})

exports.getArticle = catchAsync(async (req, res, next) => {
    let article = await Article.findById(req.params.id)
    let user
    let isFavorite = false
    if (!article) {
        return next(new AppError("No Article found with that ID", 404))
    }

    if (req.headers.authorization != undefined || req.headers.authorization != null) {
        if (req.headers.authorization.length > 15) {
            const userId = exportIdfromToken(req.headers.authorization)
            user = await User.findById(userId)
            if (user.favoriteArticles.includes(article._id)) {
                isFavorite = true
            }
        }
    }
    article = { ...article.toObject(), isFavorite }

    res.status(200).json({
        status: "success",
        data: {
            article,
        },
    })
})

exports.updateArticle = catchAsync(async (req, res, next) => {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!article) {
        return next(new AppError("No Article found with that ID", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            article,
        },
    })
})

exports.deleteArticle = catchAsync(async (req, res, next) => {
    const article = await Article.findByIdAndDelete(req.params.id)

    if (!article) {
        return next(new AppError("No Article found with that ID", 404))
    }

    res.status(204).json({
        status: "success",
        data: null,
    })
})

exports.addFavoriteArticle = catchAsync(async (req, res, next) => {
    // const user = req.user
    // const place = req.params.id
    const article = await Article.findById(req.params.id)
    if (!article) {
        return next(new AppError("No Article found with that ID", 404))
    }
    // i want to add the req.params.id once cant be repeated
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { favoriteArticles: req.params.id },
        },
        {
            new: true,
        }
    )
    // console.log(place);

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})

exports.removeFavoriteArticle = catchAsync(async (req, res, next) => {
    const article = req.params.id
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { favoriteArticles: article },
        },
        {
            new: true,
        }
    )

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
})
