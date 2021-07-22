import pg from 'pg'

const { Pool } = pg;

let database;

if(process.env.NODE_ENV === 'test'){
    database = 'sing_me_a_song_test'
} else {
    database = 'sing_me_a_song'
}

console.log(`Utilizando o banco de dados '${database}'`);

const connection = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
})

export default connection