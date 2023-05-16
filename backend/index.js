const express = require('express');
const connectToMongo = require('./db');
var cors = require('cors'); // cors allow us to call api directly from browser

// connecting to db
connectToMongo();
const app = express()
const port = process.env.PORT || 5000 //setting port number
app.use(cors());
app.use(express.json()); //it is a middleware to use req.body function

app.get('/', (req, res) => {
  res.send('hello yugant');
})

// path to authenticate user for login or creating new user
app.use('/api/auth', require('./routes/auth'));
// path to perform crud on notes
app.use('/api/notes', require('./routes/usernotes'));

app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
})