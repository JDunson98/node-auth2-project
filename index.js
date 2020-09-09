const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const usersRouter = require('./users/users-router')

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(cookieParser())
server.use(usersRouter)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})