const express = require('express')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const {fetchUserByToken} = require("../auth");
const {verify} = require("../token")

const router = express.Router()

router.use(function (req,res, next){
    fetchUserByToken(req)
        .then(user => {
            next();
        })
        .catch(e => {
            res.status(400).send({message: e});
        })
})

router.get('/', async (req, res) => {
    try{
        const user = await User.findById(verify(req.headers.authorization).id).select('-password')
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
})

router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password')
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
})

module.exports = router