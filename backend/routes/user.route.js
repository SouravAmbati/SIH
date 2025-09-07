import express from 'express';
import { getProfile, Loginuser, Logout, Registeruser } from '../controllers/User.controller.js';
import Authuser from '../middleware/auth.js';

const userRouter=express.Router();

userRouter.post('/register',Registeruser);
userRouter.post('/login',Loginuser);
userRouter.get('/get-user',Authuser,getProfile);
userRouter.get('/logout',Authuser,Logout);


export default userRouter