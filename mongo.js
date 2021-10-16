const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("Provide the password as an argument!")
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://note_react_user:${password}@cluster0.d3ga0.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'Html is easy!',
    date: new Date,
    important: true
})

// note.save().then(result => {
//     console.log('Note saved!')
//     mongoose.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})