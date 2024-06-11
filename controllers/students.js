const studentsRouter = require('express').Router()
const Student = require('../models/student')
const Game = require('../models/game')
const GamePlay = require('../models/gameplay')

// DONE Get all student details
studentsRouter.get('/',  (request, response, next) =>{
    Student.find({})
        .populate({
            path:'games',
            populate:{
                path:'game',
                model:'Game',
                select:'game_name category relay played_status '
            }
        })
        .then(students => response.json(students))
        .catch(err =>next(err))
})

// DONE Create a student 
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
// DONE GEt one student details
studentsRouter.get('/:id',(request, response,next) => {
    Student.findById(request.params.id)
        .then(student => response.json(student))
        .catch(err => next(err))
})
// INFO Delete user by ID, to be deleted in production
studentsRouter.delete('/:id', (request, response,next) =>{
    Student.findByIdAndDelete(request.params.id)
        .then(student => response.status(204).end())
        .catch(err => next(err))
})

// INFO Delete all students, to be deleted in production
studentsRouter.delete('/', (request, response, next) =>{
    Student.find({})
        .then(students => {
            students.forEach(student => {
                Student.findByIdAndDelete(student.id)
                    .then(sd => response.status(204))
                    .catch(err => next(err))
            })
            response.json({message:'All Deleted'})
        })
        .catch(err => next(err))
})

module.exports = studentsRouter