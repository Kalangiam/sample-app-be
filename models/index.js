import mongoose from "mongoose";
import dotenv from  "dotenv"

dotenv.config()

const DB_URL = process.env.DB_URL

async function mongodb() {
    try {
        await mongoose.connect(`${DB_URL}`)
        console.log("mongoDB is connected Succesfully")
    } catch (error) {
        console.log("mongoDB is not connected",error)
    }
}

export default mongodb