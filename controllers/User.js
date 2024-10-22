import UserModel from "../models/UserSchema.js"

const create = async (req,res)=>{
    try {
        let {name,email,password,confirmpassword} = req.body
        let user = await UserModel.findOne({email:req.body.email})
        
        if(!user){
            // password = await Auth.hashPassword(password)
            await UserModel.create({name,email,password,confirmpassword})
            res.status(200).send({
                message:"User Created successfully"
            })
        }
        else{
            res.status(400).send({
                message:`User with ${req.body.email} already exits`
            })
        }
    } 
    catch (error) {
        res.status(500).send({
            message: error.message || "Internal server Error"
        })
    }
}


export default {
    create
}