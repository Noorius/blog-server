const mongoose = require('mongoose')

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String
}, {collection: "users", timestamps: true});

mongoose.model('User', userScheme)