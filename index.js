import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongodb from "./models/index.js"
import IndexRouter from './routes/index.js'

dotenv.config()

const app = express()

app.use(cors());
app.use(express.json());
app.use(IndexRouter)

const PORT = process.env.PORT;

mongodb()




app.listen(PORT, ()=>console.log(`Backend is running on PORT ${PORT}`))