import connection from "../../src/database";

export async function clearDatabase(){
    await connection.query(`TRUNCATE songs RESTART IDENTITY`)
}

export async function endConnection(){
    await connection.end()
}

export async function createRecommendation(name: string){
    const youtubeLink = "https://www.youtube.com/watch?v=testing"
    const score = 8

    await connection.query(`
    INSERT INTO songs (name, youtube_link, score)
    VALUES ($1, $2, $3)
    `, [name, youtubeLink, score])
}