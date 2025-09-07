import express from 'express';
import { CollegeDetails, GetColleges } from '../controllers/College.controller.js';
import Authuser from '../middleware/auth.js';
const collegeRouter=express.Router();

collegeRouter.post('/get-colleges',Authuser,GetColleges);
collegeRouter.post('/college-details',Authuser,CollegeDetails);


export default collegeRouter