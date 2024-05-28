const gamesRouter = require('express').Router()
const Game = require('../models/game')

// TODO Get all Games
gamesRouter.get('/',(request, response, next) =>{
    Game.find({}).then(games => {
        console.log('Someeeeeeeething get all games')
        response.json(games)
    }).catch(err => next(err))
})

// TODO Create a Game
gamesRouter.post('/', (request, response, next) =>{
    const body = request.body

    const game = new Game({
        game_name: body.game_name,
        category: body.category,
        relay: body.relay,
        participants: body.participants
    })
    game.save()
        .then(savedGame => {
            response.json(savedGame)
        })
        .catch(err => next(err))
})

// TODO Get one Game details
gamesRouter.get('/:id', (request, response) => {
    const id = Number(request.params.id)
    const game = games.find(game => game.id === id)
    response.json(game)
})

// TODO Edit one Game
gamesRouter.put('/:id',(request, response) =>{

})

// TODO Delete one Game
gamesRouter.delete('/:id',(request, response) =>{

})

module.exports = gamesRouter