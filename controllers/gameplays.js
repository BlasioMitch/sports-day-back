const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const GamePlayRouter = require('express').Router()
const GamePlay = require('../models/gameplay')
const Game =  require('../models/game')
const Student = require('../models/student')
const User = require('../models/user')

const getTokenFrom = request =>{
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer')){
        return authorization.replace('Bearer ','')
    }
   return null
}

// DONE Get games played
GamePlayRouter.get('/', (request, response, next) => {
    GamePlay.find({})
        .then(pg => {
        response.json(pg)
    }).catch(err => next(err))
})
// DONE get one game played
GamePlayRouter.get('/:id',async (request, response, next) =>{
    const gamePlay = await GamePlay.findById(request.params.id)
    if (gamePlay){
        response.json(gamePlay)
    }else{
        response.json({message:'This ID does not Exist'})
    }
})
// DONE Add game plays
// DONE change the played_status of game
GamePlayRouter.post('/', async (request, response, next) => {
    const body = request.body
    try{
        // Check for authentication
        // const decodedToken = jwt.verify(getTokenFrom(request),config.SECRET)
        // if(!decodedToken.id){
        //     return response.status(401).json({error:'token invalid'})
        // }
        // const user = await User.findById(decodedToken.id)
        // if(user.username !== 'guestuser'){
            const no_points = body.players.map(p => p.position).every(p => p === null)
            console.log(no_points,' null')
            if(no_points) { // If game not played yet .ie no points assigned

                // Update Game: setting the arrray with null positions
                const gameUpdate = await Game.findByIdAndUpdate(body.game,
                    {
                        $push: {players:body.players},
                    }
                )
                // Update Students: pushing game and position to respective player
                const forUpdate = body.players.forEach(async player => {
                    await Student.findByIdAndUpdate(player.player,
                        {
                            $push:{games: {game: body.game, position: player.position}}
                        }
                    )
                })
                Promise.all([gameUpdate,forUpdate]).then(() => {
                    response.json({message:'Registered'})
                    console.log('Registration Done')
                }).catch(err => next(err))
            } else{
                // Update game to have positions
                const gameUpdel = await Game.findByIdAndUpdate(body.game,{$set:{players:[]}})
                const gameUpdate = await Game.findByIdAndUpdate(body.game,
                    {
                        $push: {players:body.players},
                        $set:{played_status:true} 
                    })
                // update students to have positions
                const students = await Student // First delete previous object with nulls
                                        .updateMany(
                                            {games:{ $elemMatch:{ game: body.game}}},
                                            {$pull:{ games: {game: body.game}}}
                                        )
                const forStUpdate = body.players.forEach(async player => { // Replace the new object with positions
                    await Student.findByIdAndUpdate(player.player,
                        {
                            $push:{games: {game: body.game, position: player.position}}
                        }
                    )
                })
    
                Promise.all([gameUpdel,gameUpdate,students,forStUpdate]).then(() => {
                    response.json({message:'played'})
                    console.log('Playing Done')
                }).catch(err => next(err))

            }
            // }else{
            //     return response.status(401).json({error:'Not authorized for this operation'})   
            // }
    }catch(err){
        console.log(err)
    }

})
// TODO Delete played // INFO Game can't delete one game
GamePlayRouter.delete('/:id', (request, response, next) =>{
    GamePlay.findByIdAndDelete(request.params.id)
        .then(gp => {
            if(gp){
                response.status(204).end()
            }else{
                response.json({message:'This ID does not Exist'})
            }
        })
        .catch(err => next(err))
})
// TODO Edit played game // INFO  Can't edit one game
GamePlayRouter.put('/:id', (request, response, next) =>{
    const body = request.body
    const editgameplay = {
        game:body.game,
        participants: body.participants
    }
    GamePlay.findByIdAndUpdate(request.params.id, editgameplay, {new:true})
        .then(egp => {
            response.json(egp)
        })
        .catch(err => next(err))
})
// TODO Delete All, INFO to be removed
GamePlayRouter.delete('/', async (request, response, next) =>{
    await GamePlay.deleteMany()
    await Game.updateMany({}, {players:[],played_status:false}, {multi:true})
    await Student.updateMany({},{games:[]},{multi:true})
})
module.exports = GamePlayRouter