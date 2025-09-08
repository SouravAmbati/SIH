import express from 'express';
import Authuser from '../middleware/auth.js';
import { startCall } from '../controllers/voice.contoller.js';

const voiceRoute=express.Router();

voiceRoute.get('/start-call',Authuser,startCall);


export default voiceRoute;