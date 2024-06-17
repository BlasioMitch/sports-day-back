const config = require('./utils/config')
const express = require('express')
const app = express()
const cors =require('cors')
const logger = require('./utils/logger')
const gamesRouter = require('./controllers/games')
const studentsRouter = require('./controllers/students')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const GamePlayRouter = require('./controllers/gameplays')
const userRouter = require('./controllers/logins')
const mongodb_uri = 'mongodb+srv://@cluster1.qrq0wbi.mongodb.net/sportsday?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
logger.info('Connecting to ', mongodb_uri)

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('Connected to MongoDB')
    })
    .catch(err =>{
        logger.info('mongodburi is ', config.MONGODB_URI)
        logger.error('Error connecting to MongoDB ',err.message)
    })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api',userRouter)
app.use('/api/students', studentsRouter)
app.use('/api/games', gamesRouter)
app.use('/api/gameplays', GamePlayRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)
 
module.exports =  app 