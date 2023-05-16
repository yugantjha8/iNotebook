const mongoose = require('mongoose')
//localhost ki jageh port number 
const mongoURI = 'mongodb://127.0.0.1:27017/inotebook' //db uri

// connecting to db
const connectToMongo = () =>{
    mongoose.connect(mongoURI);
}

module.exports = connectToMongo;