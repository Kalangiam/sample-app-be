import mongoose from 'mongoose'

const validateEmail = (value)=>{
    return String(value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
} 

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        message:"Name is required"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:validateEmail,
            message:props=>`${props.value} is Invalid email`
        },
        message:"email is required"
    },
    password:{
        type:String,
        required:true,
        message:"Password is required"
    },
    confirmpassword:{
        type:String,
        required:true,
        message:"confirm-Password is required"
    },
},{
    versionKey:false,
    collection:"users "
})

const UserModel = mongoose.model('users',userSchema)

export default UserModel