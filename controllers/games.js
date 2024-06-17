const jwt = require('jsonwebtoken')
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
    const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error:'token invalid'})
    }
    const user = await User.findById(decodedToken.id)
    if(user.username !== 'guestuser'){ //if not guestuser

        const game = new Game({
            game_name: body.game_name,
            category: body.category,
            relay: body.relay,
            gender:body.gender
        }) 
        game.save()
        .then(savedGame => {
            response.json(savedGame)
        })
        .catch(err => next(err))
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
        gender:body.gender
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
    const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).json({error:'token invalid'})
    }
    const user = await User.findById(decodedToken.id)
    if(user.username !== 'guestuser'){
        Game.findById(request.params.id)
        .then( async game =>{
            await Game.findByIdAndDelete(request.params.id)
            console.log(game)
            if (game.played_status){
                const students = await Student.find({
                    games:{ $elemMatch:{ game:request.params.id }}
                })
                students.forEach( async student => {
                    student.games = student.games.filter(game => game.id === request.params.id)
                    await student.save()
                })
                console.log('Deletion Finished')
            }else {
                console.log('No players recorded')
            }
            response.status(204).send({message:'ok'})
        }).catch(err => next(err))
    }else{
        return response.status(401).json({error:'Not authorized for this operation'})
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