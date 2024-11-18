import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SALT_ROUND = 10;

const hashPassword =async(password)=>{
    let salt = await bcrypt.genSalt(SALT_ROUND)
    let hash = await bcrypt.hash(password,salt)
    return hash
}

const hashCompare = async(password,hash)=>{
    return await bcrypt.compare(password,hash)
}

const createToken = async(payload)=>{
    let token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
    return token
}

const decodeToken=async(token)=>{
    return jwt.decode(token)
}

export default {
    hashPassword,
    hashCompare,
    createToken,
    decodeToken
}