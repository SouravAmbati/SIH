import express from 'express';
import { analyzeAnswers, Brief, CareerOption, DreamAnalyze, getQuizQuestions } from '../controllers/Stream.controller.js';
import Authuser from '../middleware/auth.js';

const streamRouter=express.Router();

streamRouter.post('/questions',Authuser,getQuizQuestions);
streamRouter.post('/analyze-quiz',Authuser,analyzeAnswers);
streamRouter.post('/dream',Authuser,DreamAnalyze);
streamRouter.post('/career-options',Authuser,CareerOption);
streamRouter.post('/brief',Authuser,Brief);


export default streamRouter