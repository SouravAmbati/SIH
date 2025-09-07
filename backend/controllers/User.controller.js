import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import validator from "validator"

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// export const Registeruser=async(req,res)=>{
//     try {
//         const {fullname,age,gender,status,email,password}=req.body;
//         const exist=await userModel.findOne({email});
//         if(exist){
//             return res.json({success:false,message:"User Already Exist"});
//         }
//         if(!validator.isEmail(email)){
//             return res.json({success:false,message:"Please enter a valid email"})
//         }
//         const salt=await bcrypt.genSalt(10);
//         const hashedPassword=await bcrypt.hash(password,salt)
//         const newUser=new userModel({
//             fullname,
//             age,
//             gender,
//             status,
//             email,
//             password:hashedPassword
//         })
//         const user=await newUser.save();
//         const token=createToken(user._id);
//         res.json({success:true,token,_id:user._id,userData:user})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }

// export const Loginuser=async(req,res)=>{
//     try {
//         const {email,password}=req.body;
//         const user=await userModel.findOne({email});
//         if(!user){
//             return res.json({success:false,message:"user doesn't exist"})
//         }
//         const isMatch=await bcrypt.compare(password,user.password);
//         if(isMatch){
//             const token=createToken(user._id);
//             res.json({success:true,token,userData:user})
//         }else{
//             res.json({success:false,message:"Invalid Credentials"})
//         }
//     } catch (error) {
//          console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }


export const Registeruser = async (req, res) => {
    try {
        const { fullname, age, gender, status, email, password } = req.body;

        // Check if user exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            fullname,
            age,
            gender,
            status,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Create token
        const token = createToken(user._id);

        // Send token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ success: true, _id: user._id, userData: user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Login Controller
export const Loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = createToken(user._id);

        // Send token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ success: true, userData: user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}