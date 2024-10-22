import express from "express"
import UserController from "../controllers/User.js"


const router = express.Router()

router.post('/register',UserController.create)

export default router