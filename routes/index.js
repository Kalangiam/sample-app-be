import express from "express"
import Indexcontroller from '../controllers/index.js'
import UserRoutes from '../routes/User.js'


const router = express.Router()

router.get('/',Indexcontroller.home)
router.use('/users', UserRoutes)


export default router