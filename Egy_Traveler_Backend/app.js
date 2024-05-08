const express = require("express")
const morgan = require("morgan")
const AppError = require("./utils/appError")
const app = express()
const cors = require("cors")
const { getFavoritePlaces } = require("./Controllers/placeController")
const { auth } = require("./validators/tokenChecker")
app.use(express.json())

app.use(morgan("dev"))
app.use(cors())
app.use("/uploads", express.static("uploads"))

app.use("/api/v1/users", require("./Routers/userRoutes"))
app.use("/api/v1/auth", require("./Routers/authRoutes"))
app.use("/api/v1/event", require("./Routers/eventRoutes"))
app.use("/api/v1/place", require("./Routers/placeRoutes"))
app.use("/api/v1/trips", require("./Routers/tripRoutes"))
app.use("/api/v1/reviews", require("./Routers/reviewRoutes"))
app.use("/api/v1/articles", require("./Routers/articleRouters"))
app.use("/api/v1/categorys", require("./Routers/categoryRoutes"))
////////////////////////////////////////////////////////
app.get("/api/v1/favorite",auth, getFavoritePlaces)

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use((err, req, res, next) => {
    // Check if the error is an instance of your AppError class
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }

    console.log(err)
    // Handle other errors
    res.status(500).json({
        status: "error",
        message: err.message,
        statusCode: err.code,
    })
})

module.exports = app
