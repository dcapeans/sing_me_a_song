import connection from '../database'
import { Song } from "../interfaces"

export async function findById(id: Number): Promise<Song>{
    const result = await connection.query(`
        SELECT * from songs
        WHERE id = $1
    `, [id])

    return result.rows[0]
}

export async function updateScore(newScore: Number, id: Number){
    await connection.query(`
        UPDATE songs
        SET score=$1
        WHERE id=$2
    `, [newScore, id])
}

export async function deleteSong(id: Number){
    await connection.query(`
        DELETE from songs
        WHERE id=$1
    `, [id])
}

export async function insert(name: String, youtubeLink: String){
    await connection.query(`
        INSERT INTO songs (name, youtube_link)
        VALUES ($1, $2)
    `, [name, youtubeLink])
}

export async function findByScore(highScore?: Number, lowScore?: Number): Promise<Song[]>{
    const select = `SELECT * from songs `
    let where;
    let variables;

    if(lowScore && highScore){
        where = `WHERE score >=$1 AND score <= $2 `
        variables = [lowScore, highScore]
    }else if(highScore && !lowScore){
        where = `WHERE score > $1  `
        variables = [highScore]
    }else if(!highScore && !lowScore){
        where = ''
    }
    const orderBy = `ORDER BY random()`

    const result = await connection.query(select + where + orderBy, variables)

    return result.rows
}

export async function findTopByAmount(amount: Number): Promise<Song[]>{
    const result = await connection.query(`
        SELECT * from songs
        ORDER BY score DESC
        LIMIT $1
    `, [amount])

    return result.rows
}