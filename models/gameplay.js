const mongoose = require('mongoose')

const gamesPlayedSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    position: {
        type: Number, min: 1, max: 4
    }

})

gamesPlayedSchema.set('toJSON',{
    transform: (document, returnedGP) => {
        returnedGP.id = returnedGP._id.toString()
        delete returnedGP._id
        delete returnedGP.__v
    }
})

module.exports = mongoose.model('GamesPlayed', gamesPlayedSchema)