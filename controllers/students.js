const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Game = require('../models/game')

// DONE Get all student details
studentsRouter.get('/', (request, response, next) =>{
    Student.find({}).then(students =>{
        console.log('Students come...')
        response.json(students)
    }).catch(err => next(err))
})

// TODO Create a student 
// INFO To be deleted, not Required in production 
studentsRouter.post('/',(request, response,next) => {
    const body = request.body
    const student = new Student({
        first_name: body.first_name,
        last_name: body.last_name,
        other_name: body.other_name,
        dob: body.dob,
        house: body.house,

    })
 
    student.save()
        .then(savedStudent =>{
            response.json(savedStudent)
        })
        .catch( err => next(err))
})
// TODO GEt one student details
studentsRouter.get('/:id',(request, response,next) => {
    Student.findById(request.params.id).populate({path:'games_played', populate:{path:'game',participants:0}})
        .then(student => {
            if(student){
                response.json(student)
            }else {
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})
studentsRouter.delete('/:id', (request, response,next) =>{
    Student.findByIdAndDelete(request.params.id)
        .then(student => response.status(204).end())
        .catch(err => next(err))
})


module.exports = studentsRouter