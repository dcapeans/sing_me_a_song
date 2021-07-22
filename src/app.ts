import express from "express";
import cors from "cors";
import { Request, Response } from 'express'
import connection from './database'

import * as RecommendationController from './controllers/recommendationController'

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", RecommendationController.create);

app.post("/recommendations/:id/upvote", RecommendationController.upvote)

app.post("/recommendations/:id/downvote", RecommendationController.downvote)

app.get("/recommendations/random", )

app.get("/recommendations/top/:amount", )

export default app;
