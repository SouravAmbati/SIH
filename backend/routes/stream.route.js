import express from 'express';
import { analyzeAnswers, Brief, CareerOption, chatBot, courseOpportunities, DreamAnalyze, getQuizQuestions, Roadmap } from '../controllers/Stream.controller.js';
import Authuser from '../middleware/auth.js';

const streamRouter=express.Router();

streamRouter.post('/questions',Authuser,getQuizQuestions);
streamRouter.post('/analyze-quiz',Authuser,analyzeAnswers);
streamRouter.post('/dream',Authuser,DreamAnalyze);
streamRouter.post('/career-options',Authuser,CareerOption);
streamRouter.post('/brief',Authuser,Brief);
streamRouter.get('/chat',Authuser,chatBot);
streamRouter.post('/opportunities',Authuser,courseOpportunities);
streamRouter.post('/roadmap',Authuser,Roadmap);


export default streamRouter