const logger = require('./logger')
const morgan = require('morgan')

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.info(error.message)

	if(error.name === 'CastError'){
		return response.status(400).send({ error: 'Malformatted ID' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	}

	next(error)
}

morgan.token('content', function(request){
	logger.info('Req: ', request.body)
	return [
		JSON.stringify(request.body)
	]
})

module.exports = {
	unknownEndpoint,
	errorHandler,
	morgan
}