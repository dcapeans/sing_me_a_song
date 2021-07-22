import express from "express";
import cors from "cors";

import * as RecommendationController from './controllers/recommendationController'

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", RecommendationController.create);

app.post("/recommendations/:id/upvote", RecommendationController.upvote)

app.post("/recommendations/:id/downvote", RecommendationController.downvote)

app.get("/recommendations/random", RecommendationController.random)

app.get("/recommendations/top/:amount", RecommendationController.getTopByAmount)

export default app;
