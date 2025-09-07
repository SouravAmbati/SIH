import express from 'express';
import { Loginuser, Registeruser } from '../controllers/User.controller.js';

const userRouter=express.Router();

userRouter.post('/register',Registeruser);
userRouter.post('/login',Loginuser);


export default userRouter