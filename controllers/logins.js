const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const UserRouter = require('express').Router()

UserRouter.get('/login',(request, response, next) =>{
    console.log('In login')
})
// Create User
UserRouter.post('/users', async (request, response,next) =>{
    const saltRounds = 10
    const pass_hash = await bcrypt.hash(request.body.password, saltRounds)
    const userObj = new User({
        username: request.body.username,
        password_hash: pass_hash
    })

    await userObj.save()
    response.status(201).json(userObj)
})
// Login user
UserRouter.post('/login', async (request, response,next) =>{
    const {username,password} = request.body
    const user = await User.findOne({username:username})
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password,user.password_hash)

        if (!(user && passwordCorrect)){
            return response.status(401).json({
                error:'Invalid username or password'
            })
        }
        const userToken = {
            username: user.username,
            id:user.id
        }
        const token = jwt.sign(userToken, process.env.SECRET)
        response.status(200).send({token,username:user.username})
})
 
module.exports = UserRouter