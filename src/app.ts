import express from "express";
import cors from "cors";
import { Request, Response } from 'express'
import connection from './database'

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommendations", async (req: Request, res: Response) => {
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
});

export default app;
