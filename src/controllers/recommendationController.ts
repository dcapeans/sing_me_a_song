import { Request, Response } from 'express'

import * as RecommendationRepository from '../repositories/recommendationsRepository'
import * as RecommendationService from '../services/recommendationsService'

export async function create(req: Request, res: Response){
    try {
        const { name, youtubeLink } = req.body
        const isValid = await RecommendationService.validateNameLink(name, youtubeLink)
        if(!isValid) return res.sendStatus(400)
        await RecommendationRepository.insert(name, youtubeLink)

        res.sendStatus(201)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function upvote(req: Request, res: Response){
    try {
        const id = +req.params.id
        const recommendation = await RecommendationRepository.findById(id)
        const newScore = recommendation.score + 1
        await RecommendationRepository.updateScore(newScore, id)

        res.sendStatus(200)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function downvote(req: Request, res: Response){
    try {
        const id = +req.params.id
        const recommendation = await RecommendationRepository.findById(id)
        const newScore = recommendation.score - 1

        await RecommendationService.deleteIfScoreBelowMinimum(newScore, id)

        await RecommendationRepository.updateScore(newScore, id)

        res.sendStatus(200)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function random(req: Request, res: Response){
    try {
        let result;
        result = await RecommendationService.randomizer()

        const existSongs = await RecommendationService.checkIfExistsSongs(result)
        if(!existSongs) return res.sendStatus(404)
        const recommendation = result[0]
        res.send(recommendation).status(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function getTopByAmount(req: Request, res: Response){
    try {
        const amount = +req.params.amount
        const result = await RecommendationRepository.findTopByAmount(amount)

        res.send(result).status(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}