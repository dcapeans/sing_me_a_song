import { Request, Response } from 'express'
import connection from '../database'

export async function create(req: Request, res: Response){
    try {
        const { name, youtubeLink } = req.body
        const regexp = new RegExp(/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/, 'g') 

        if(!name || !youtubeLink) return res.sendStatus(400)
        if(!youtubeLink.match(regexp)) return res.sendStatus(400)

        await connection.query(`
        INSERT INTO songs (name, youtube_link)
        VALUES ($1, $2)
        `, [name, youtubeLink])

        res.sendStatus(201)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function upvote(req: Request, res: Response){
    try {
        const id = +req.params.id

        const result = await connection.query(`
            SELECT * from songs
            WHERE id = $1
        `, [id])

        const recommendation = result.rows[0]
        const newScore = recommendation.score + 1

        await connection.query(`
            UPDATE songs
            SET score=$1
            WHERE id=$2
        `, [newScore, id])

        res.sendStatus(200)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function downvote(req: Request, res: Response){
    try {
        const id = +req.params.id

        const result = await connection.query(`
            SELECT * from songs
            WHERE id = $1
        `, [id])
        console.log(result.rows)
        const recommendation = result.rows[0]
        const newScore = recommendation.score - 1

        if(newScore < -5){
            await connection.query(`
            DELETE from songs
            WHERE id=$1
            `, [id])

            return res.sendStatus(200)
        }

        await connection.query(`
            UPDATE songs
            SET score=$1
            WHERE id=$2
        `, [newScore, id])

        res.sendStatus(200)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function random(req: Request, res: Response){
    try {
        const random = Math.random()
        let result;

        if(random >= 0.7){
            result = await connection.query(`
            SELECT * from songs
            WHERE score >= $1 AND score <= $2
            ORDER BY random()
            `, [-5, 10])
        } else {
            result = await connection.query(`
            SELECT * from songs
            WHERE score > $1
            ORDER BY random()
            `, [10])
        }
        
        if(result.rows.length === 0){
            result = await connection.query(`
            SELECT * from songs
            ORDER BY random()
            `)
        }

        if(result.rows.length === 0) return res.sendStatus(404)

        const recommendation = result.rows[0]
        res.send(recommendation).status(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function getTopByAmount(req: Request, res: Response){
    try {
        const amount = +req.params.amount

        const result = await connection.query(`
        SELECT * from songs
        ORDER BY score DESC
        LIMIT $1
        `, [amount])

        const topList = result.rows

        res.send(topList).status(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}