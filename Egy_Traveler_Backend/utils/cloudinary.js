const cloudinary = require("../config/cloudinaryConnection")

exports.uploadIMG = async (req, res, next) => {
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "EgyTravelers/",
        })
        req.body.image = result.secure_url
    }
    next()
}
exports.uploadImages = async (req, res, next) => {
    const images = []


    if (req.files) {
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "EgyTravelers/",
            })

            images.push(result.secure_url)
        }
        req.body.images = images
    }
    next()
}
