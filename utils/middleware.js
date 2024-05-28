const requestLogger = (request, response, next) =>{
    console.log('Method: ',request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('----')
    next()
}

const unknownEndPoint = (request, response, next) =>{
    response.status(404).send({error:"Endpoint doesn't exist"})
}

// TODO Error Handler here

module.exports = {
    requestLogger, unknownEndPoint
}