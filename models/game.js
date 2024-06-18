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
    player_no: {
        type: Number,
        default:1
    },
    gender: {
        type: String,
        required: true,
        enum:['girls','boys']
    },
    played_status: {
        type: Boolean,
        default: false,
    },
    players:[
        {
            player: {
                type: mongoose.Schema.Types.ObjectId, 
                ref:'Student'
            },
            position: {
                type:  Number, min: 1, max:8
            
            }
        }
    ]
})

gameSchema.set('toJSON',{
    transform: (document, returnedGame) =>{
        returnedGame.id = returnedGame._id.toString()
        // delete returnedGame._id
        delete returnedGame.__v
    }
})


module.exports = mongoose.model('Game', gameSchema)

