const studentsRouter = require('express').Router()
const Student = require('../models/student')

// TODO Get all student details
studentsRouter.get('/', (request, response, next) =>{
    Student.find({}).then(students =>{
        console.log('Students come...')
        response.json(students)
    }).catch(err => next(err))
})

// TODO Create a student 
studentsRouter.post('/',(request, response) => {
    const body = request.body
    const student = new Student({
        first_name: body.first_name,
        last_name: body.last_name,
        other_name: body.other_name,
        dob: body.dob,
        house: body.house,
        games_played:body.games_played

    })

    student.save()
        .then(savedStudent =>{
            response.json(savedStudent)
        })
        .catch( err => next(err))
})
// TODO GEt one student details
studentsRouter.get('/:id',(request, response) => {
    const id = Number(request.params.id)
    const student = students.find(student => student.id === id)
    response.json(student)
})
// TODO Edit one student details
studentsRouter.put('/:id', (request,response) =>{

})
// TODO Delete one student
studentsRouter.delete('/:id', (request, response) => {

})

module.exports = studentsRouter