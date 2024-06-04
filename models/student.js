const mongoose = require('mongoose')

// DONE better models with validation and referencing

const studentSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 3
    },
    last_name: {
        type: String,
        required: true,
        minLength: 3    },
    other_name: {
        type: String,
        minLength: 3    },
    dob: {
        type: Date,
        required: true
    },
    house: {
        type: String,
    },
})

studentSchema.set('toJSON',{
    transform: (document, returnedStudent) =>{
        returnedStudent.id = returnedStudent._id.toString()
        delete returnedStudent._id
        delete returnedStudent.__v
    }
})

module.exports= mongoose.model('Student', studentSchema)
