import express from "express"
import UserController from "../controllers/User.js"


const router = express.Router()

router.post('/register', UserController.create)
router.post('/login', UserController.login)
router.post('/forget-password', UserController.sendResetLink)
router.post('/reset-password', UserController.resetPassword)

export default router