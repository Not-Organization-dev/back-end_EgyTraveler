const express = require("express")
const router = express.Router()
const userController = require("../Controllers/userController")
const { auth } = require("../validators/tokenChecker")
const { changePasswordValidator, deleteAccountValidator } = require("../validators/userValidator")
const { forgetPassword, resetPassword } = require("../Controllers/authController")
const { uploadIMG } = require("../utils/cloudinary")
const upload = require("../utils/multer")

router.get("/get-profile", auth, userController.getMe)
router.put("/edit-profile", auth,upload.single("avatar"),uploadIMG,userController.editProfile)
router.put("/change-password", auth, changePasswordValidator, userController.changePassword)
router.delete("/delete-account", auth, deleteAccountValidator, userController.deleteAccount)
router.post("/forgot-password", forgetPassword)
router.put("/reset-password", resetPassword)

module.exports = router
