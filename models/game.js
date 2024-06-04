const mongoose = require('mongoose')

// DONE better models with validation and referencing
const gameSchema = new mongoose.Schema({
    game_name: {
        type: String,
        required: true,
        minLength: 3
    }, 
    category: {
        type: String,
        required: true,
        minLength: 3
    }, 
    relay: {
        type: Boolean,
        default: false,
        required: true

    },
    played_status: {
        type: Boolean,
        default: false,
    }
})

gameSchema.set('toJSON',{
    transform: (document, returnedGame) =>{
        returnedGame.id = returnedGame._id.toString()
        delete returnedGame._id
        delete returnedGame.__v
    }
})


module.exports = mongoose.model('Game', gameSchema)

