const GamePlayRouter = require('express').Router()
const GamePlay = require('../models/gameplay')
const Game =  require('../models/game')
const Student = require('../models/student')
// DONE Get games played
GamePlayRouter.get('/', (request, response, next) => {
    GamePlay.find({}).then(pg => {
        response.json(pg)
    }).catch(err => next(err))
})
// DONE get one game played
GamePlayRouter.get('/:id',async (request, response, next) =>{
    const gamePlay = await GamePlay.findById(request.params.id)
                            .populate("game")
                            .populate("player") //populate the fields
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
    // DONE Check if IDs exist
    const games = await Game.find({})
    const game_ids = games.map(g => g.id)
    const students = await Student.find({})
    const student_ids = students.map(s => s.id)
    const game_available = game_ids.includes(body.game)
    console.log(game_available)
    const students_available = body.participants.map(p => student_ids.includes(p.player)).every(i => i===true)
    console.log(students_available)
    if (game_available){ 
        if(students_available){
            body.participants.forEach(async participant => {
            const gamePlay = new GamePlay({
                game: body.game,
                player: participant.player,
                position:participant.position
            })
            Game.findByIdAndUpdate(body.game,{played_status:true},{new:true})
            .then(g => console.log('Game updated'))
            .catch(err => next(err))
            gamePlay.save().then(gp => {
                console.log('Participant saved')
            }).catch(err => next(err))
        })
        GamePlay.find()
            .where('game').equals(body.game)
            .then(gps => {
                response.json(gps)
            })
            .catch(err => next(err))
        
        }else{
            response.json({message:'Students do not Exist'})
        }
    }else{
        response.json({message:'Game does not Exist'})
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
GamePlayRouter.delete('/', (request, response, next) =>{
    GamePlay.find({})
        .then(gameplays => {
            gameplays.forEach(gameplay => {
                GamePlay.findByIdAndDelete(gameplay.id)
                    .then(sd => response.status(204))
                    .catch(err => next(err))
            })
            response.json({message:'All Deleted'})
        })
        .catch(err => next(err))
    })
module.exports = GamePlayRouter