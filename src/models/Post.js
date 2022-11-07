const mongoose = require('mongoose')
const User = require('../models/User')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: User,
    liked: [User],
    comments: [{user: {id: String, name: String, surname: String}, body: String, date: Date}]
}, { timestamps: true})

mongoose.model('Post', postSchema);