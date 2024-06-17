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

// DONE Error Handler here
const errorHandler = (error, request, response, next) => {
    if(error.name === 'CastError'){
        return response.status(400).send({error:'malformatted ID'})

    }else if (error.name === 'ValidationError'){
        return response.status(400).json({error:error.message})
    }else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error:'Invalid Token'})
    }

    next(error)
}
 
module.exports = {
    requestLogger, unknownEndPoint, errorHandler
}