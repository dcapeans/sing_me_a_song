import connection from "../../src/database";

export async function clearDatabase(){
    await connection.query(`TRUNCATE songs RESTART IDENTITY`)
}

export async function endConnection(){
    await connection.end()
}

export async function createRecommendation(){
    const name = "test"
    const youtubeLink = "https://www.youtube.com/watch?v=testing"

    await connection.query(`
    INSERT INTO songs (name, youtube_link)
    VALUES ($1, $2)
    `, [name, youtubeLink])
}