require('dotenv/config')
const mongoose = require('mongoose')

const url = process.env.DB_URI
mongoose.connect(url)
    .then(result => {
        console.log("Connected to DB")
    })
    .catch(error => {
        console.log("Error connecting to the DB: ", error.message)
    })

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 2,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
})
  
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Note', noteSchema)