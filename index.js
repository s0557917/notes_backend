const { response, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')
const app = express()

morgan.token('content', function(request, response){
    console.log("Req: ", request.body)
    return [
        JSON.stringify(request.body)
    ]
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'Malformatted ID'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())
app.use(express.static('build'))
app.use(errorHandler)

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note =>{
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))  
})

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })  
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
    })
  
    note.save()
      .then(savedNote => savedNote.toJSON())
      .then(formattedNote => response.json(formattedNote))
      .catch(error => next(error))  
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content, 
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
})