
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.IMGNAME,
    api_key: process.env.IMGKEY,
    api_secret: process.env.IMGAPISECRET,
})

module.exports = cloudinary
