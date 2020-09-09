const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")
const restrict = require("../middleware/restrict")

const router = express.Router()

router.get("/api/users", restrict("admin"), async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})

router.post("/api/register", async (req, res, next) => {
    try {
        const {username, password, department} = req.body
        const user = await Users.findBy({username}).first()

        if (user) {
            return res.status(409).json({
                message: "Username is already taken",
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14),
            department,
        })

        res.status(201).json(newUser)
    } catch(err) {
        next(err)
    }
})

router.post("/api/login", async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await Users.findBy({username}).first()

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials",
            })
        }

        const token = jwt.sign({
            userId: user.id,
            userRole: "admin",
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.json({
            message: `Welcome ${user.username}!`,
        })
    } catch(err) {
        next(err)
    }
})

router.get("/api/logout", async (req, res, next) => {
	try {
		// this will delete the session in the database and try to expire the cookie,
		// though it's ultimately up to the client if they delete the cookie or not.
		// but it becomes useless to them once the session is deleted server-side.
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router