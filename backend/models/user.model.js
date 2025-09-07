import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fullname:{type:String,required:true},
    age:{type:Number,required:true},
    gender:{type:String,required:true},
    status:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

const userModel=mongoose.models.user||mongoose.model('user',userSchema);

export default userModel;