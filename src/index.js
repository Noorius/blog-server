const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('./models/Post')
require('./models/User')

require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use('/posts', require('./routes/posts'))
app.use('/user', require('./routes/users'))
app.use('/profile', require('./routes/profile'))

mongoose.connect(process.env.MONGODB_CONNECTION_URL);
mongoose.connection.on('connected', () => {
    console.log('Connected to DB')
})

const PORT = process.env.PORT ?? 3004

app.listen(PORT, () => {
    console.log(`Server is running htttp://localhost:${PORT}`);
})

