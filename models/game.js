const mongoose = require('mongoose')

// TODO better models with validation and referencing
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
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ] 
})

gameSchema.set('toJSON',{
    transform: (document, returnedGame) =>{
        returnedGame.id = returnedGame._id.toString()
        delete returnedGame._id
        delete returnedGame.__v
    }
})


module.exports = mongoose.model('Game', gameSchema)

