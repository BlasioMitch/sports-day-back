const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const gamesRouter = require('express').Router()
const Game = require('../models/game')
const GamePlay = require('../models/gameplay')
const Student = require('../models/student')
const User = require('../models/user')

const getTokenFrom = request =>{
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer')){
        return authorization.replace('Bearer ','')
    }
    return null
}
// DONE Get all Games
gamesRouter.get('/', async (request, response, next) =>{
        Game.find({})
        .populate({
            path:'players',
            populate:{
                path:'player',
                model:'Student',
                select:'id first_name last_name other_name house dob'
            }
        })
        .then(games => {
            response.json(games)
        }).catch(err => next(err))
})

// DONE Create a Game || Check for participants to edit the gamesplayed schema
gamesRouter.post('/', async (request, response, next) =>{
    const body = request.body
    // check for authentication
    const decodedToken = jwt.verify(getTokenFrom(request),config.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error:'token invalid'})
    }
    const user = await User.findById(decodedToken.id)
    if(user.username !== 'guestuser'){ //if not guestuser
        if (body.category !== 'All'){

            const game = new Game({
                game_name: body.game_name,
                category: body.category,
                relay: body.relay,
                gender:body.gender,
                player_no:body.player_no,
                players:[]
            }) 
            game.save()
            .then(savedGame => {
                response.json(savedGame)
            })
            .catch(err => next(err))
        }else{
            const categories = ["Under 13","13 & 14","15 & Above"]
            categories.forEach(category =>{
                const game = new Game({
                    game_name: body.game_name,
                    category: category,
                    relay: body.relay,
                    gender:body.gender,
                    player_no:body.player_no,
                    players: []
                })
                game.save()
                .then(() => {
                    console.log('game saved for ',category)
                }).catch(err => next(err))
            })
            response.json({message:'Done'})
        }
    }else{
        return response.status(401).json({error:'Not authorized for this operation'})
    }
})

// DONE Get one Game details
gamesRouter.get('/:id', (request, response, next) => {
    Game.findById(request.params.id)
        .populate({
            path:'players',
            populate: {
                path:'player',
                model:'Student',
                select:'id first_name last_name other_name house dob'
            }
        })
        .then(game =>{
            if (game){
                    response.json(game)
            } else {
                response.status(404).send({error: `Could not find ID ${request.params.id}`})
            }
        })
        .catch(err => next(err))
})

// DONE Edit one Game || Check When adding participants to access the games played schema
gamesRouter.put('/:id',(request, response, next) =>{
    const body = request.body
    const game = {
        game_name: body.game_name,
        category: body.category,
        relay: body.relay,
        played_Status: body.played_status,
        gender:body.gender,
        player_no:body.player_no
    }

    Game.findByIdAndUpdate(request.params.id, game, {new:true})
        .then(updatedGame => {
            response.json(updatedGame)
        })
        .catch(err => next(err))
})

// TODO Delete one Game 
// INFO Check if game was played
gamesRouter.delete('/:id',async (request, response,next) =>{
    try{
        const decodedToken = jwt.verify(getTokenFrom(request),config.SECRET)
        if(!decodedToken.id){
            return response.status(401).json({error:'token invalid'})
        } 
        const user = await User.findById(decodedToken.id)
        if(user.username !== 'guestuser'){
            const students = await Student
                                    .updateMany(
                                        {games:{ $elemMatch:{ game: request.params.id}}},
                                        {$pull:{ games: {game: request.params.id}}}
                                    )
            const game = await Game.findByIdAndDelete(request.params.id)
                                    
            Promise.all([students,game]).then(()=>{
                console.log('Deletion Complete')
                response.status(204).json({Message:"Done"})
            }).catch(err => next(err))
        }else{
            return response.status(401).json({error:'Not Authorized for this operation'})
        } 
    } catch(err) {
        console.log(err)
    }

})
// delete all games
gamesRouter.delete('/', (request, response, next) => {
    Game.find({})
        .then(games =>{
            games.forEach(game => {
                Game.findByIdAndDelete(game.id)
                    .then(gd => response.status(204))
                    .catch(err => next(err))
            })
            response.json({message:'All deleted'})
        })
        .catch(err => next(err))
})

module.exports = gamesRouter