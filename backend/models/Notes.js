const mongoose = require('mongoose')
const { Schema } = mongoose;

// creating notes schema
const NotesSchema = new Schema({
    // this tells db to enter the note under particular user
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', NotesSchema);