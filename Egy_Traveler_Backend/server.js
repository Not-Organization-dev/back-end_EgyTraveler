const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const app = require("./app")
require("./config/mongoConnection")

const port = process.env.PORT || 8080
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED Rejection! Shutting down... ")
    console.log(err)
    console.log(err.name, err.message)

    server.close(() => {
        process.exit(1) // zero stands for success and one stands for uncaught exception);
    })
})
