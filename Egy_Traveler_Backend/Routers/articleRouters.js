const express = require("express")
const articleController = require("../Controllers/articleController")
const { auth, allowTo } = require("../validators/tokenChecker")
const upload = require("../utils/multer")
const { uploadIMG } = require("../utils/cloudinary")

const router = express.Router()

router
    .route("/")
    .get(articleController.getAllArticles)
    .post(auth, allowTo("admin"), upload.single("image"), uploadIMG, articleController.createArticle)

router
    .route("/:id")
    .get(articleController.getArticle)
    .patch(auth, allowTo("admin"), articleController.updateArticle)
    .delete(auth, allowTo("admin"), articleController.deleteArticle)

router.route("/favorite/:id").put(auth, articleController.addFavoriteArticle).delete(auth, articleController.removeFavoriteArticle)

module.exports = router
