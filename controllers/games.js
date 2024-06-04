const gamesRouter = require('express').Router()
const Game = require('../models/game')
const GamePlay = require('../models/gameplay')
// DONE Get all Games
gamesRouter.get('/',(request, response, next) =>{
    Game.find({}).then(games => {
        response.json(games)
    }).catch(err => next(err))
})

// DONE Create a Game || Check for participants to edit the gamesplayed schema
gamesRouter.post('/', (request, response, next) =>{
    const body = request.body

    const game = new Game({
        game_name: body.game_name,
        category: body.category,
        relay: body.relay,
    })
    game.save()
        .then(savedGame => {
            response.json(savedGame)
        })
        .catch(err => next(err))
})

// DONE Get one Game details
gamesRouter.get('/:id', (request, response, next) => {
    Game.findById(request.params.id)
        .then(game =>{
            if (game){
                GamePlay.find({})
                    .select()
                    .where('game').equals(request.params.id)
                    .populate({
                        path:'player',
                        model:'Student',
                        select:'first_name last_name other_name house'
                    })
                    .then(gp =>{
                        const gpj = {
                            game_name:game.game_name,
                            relay:game.relay,
                            category:game.category,
                            category:game.status,
                            players:gp

                        }
                        response.json(gpj)
                    })
            } else {
                response.status(404).end()
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
        played_Status: body.played_status
    }

    Game.findByIdAndUpdate(request.params.id, game, {new:true})
        .then(updatedGame => {
            response.json(updatedGame)
        })
        .catch(err => next(err))
})

// TODO Delete one Game 
// INFO Check if game was played
gamesRouter.delete('/:id',(request, response,next) =>{
    Game.findByIdAndDelete(request.params.id)
        .then(() =>{
            response.status(204).end()
        })
        .catch(err => next(err))
})

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