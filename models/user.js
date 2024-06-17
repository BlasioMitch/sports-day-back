const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 6,
        required: true
    },
    password_hash : {
        type: String,
        required: true

    }
}) 

userSchema.set('toJSON',{
    transform: (document, returnedUser) =>{
        returnedUser.id = returnedUser._id.toString()
        delete returnedUser._id
        delete returnedUser.__v
    }
})

module.exports = mongoose.model('User', userSchema)