import * as RecommendationRepository from '../repositories/recommendationsRepository'

export async function validateNameLink(name: String, youtubeLink: String){
    const regexp = new RegExp(/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/, 'g') 

    if(!name || !youtubeLink) return null
    if(!youtubeLink.match(regexp)) return null

    return true
}

export async function randomizer(){
    const random = Math.random()
    let result;

    if(random >= 0.7){
        result = await RecommendationRepository.findByScore(10, -5)
    } else {
        result = await RecommendationRepository.findByScore(10)
    }
    if(result.length === 0){
        result = await RecommendationRepository.findByScore()
    }

    return result
}

export async function checkIfExistsSongs(result: any[]){
    if(result.length === 0) return null
    return true
}

export async function deleteIfScoreBelowMinimum(score: Number, id: Number){
    if(score < -5){
        await RecommendationRepository.deleteSong(id)
        return true
    }
}