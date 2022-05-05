const { notesRouter, middleware, morgan } = require('./controllers/notes')
const config = require('../utils/config')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()

mongoose.connect(config.DB_URI)
	.then(() => console.log('Connected to DB'))
	.catch(error => console.log('Error connecting to the DB: ', error.message))

app.use(express.json())
app.use('/api/notes', notesRouter)
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.static('build'))
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app