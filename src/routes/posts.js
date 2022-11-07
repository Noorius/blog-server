const express = require('express')
const mongoose = require("mongoose");

const {verify, sign} = require('../token');
const { fetchUserByToken } = require('../auth');

const router = express.Router();
// router.use(function (req,res, next){
//     fetchUserByToken(req)
//         .then(user => {
//             next();
//         })
//         .catch(e => {
//             res.status(400).send({message: e});
//         })
// })

const Post = mongoose.model('Post');

router.get('/', async (req, res) => {
    const posts = await Post.find().sort({createdAt: -1});
    res.send(posts)
})

router.get('/user', async (req, res) => {
    const posts = await Post.find({ 'author.email': verify(req.headers.authorization).email }).sort({createdAt: -1});
    res.send(posts)
})

router.get('/search/:q', async (req, res) => {
    try{
        const post = await Post.find({
            $or:[{title: {$regex: req.params.q, $options: 'i'}},{body: {$regex: req.params.q, $options: 'i'}}]
        });
        res.send(post);
    } catch (e){
        res.status(500).send({message: e.message});
    }
})

router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.send(post);
    } catch (e){
        res.status(500).send({message: e.message});
    }
})

router.patch('/:id', async (req, res) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.send(post)
    }catch (e) {
        res.status(500).send({message: e.message})
    }
})

router.patch('/:id/like', async (req, res) => {
    try{
        let post = await Post.findById(req.params.id)
        let curr_user = verify(req.headers.authorization)

        let index = post.liked.findIndex((obj) => obj.id === curr_user.id)
        if( index === -1 ){
            post.liked.push(curr_user)
        }else{
            post.liked.splice(index, 1)
        }

        post.save()
        res.send(post)
    }catch (e) {
        res.status(500).send({message: e.message})
    }
})

router.patch('/:id/comment', async (req, res) => {
    try{
        let post = await Post.findById(req.params.id)
        let curr_user = verify(req.headers.authorization)

        post.comments.push({
            user: {
                id: curr_user.id,
                name: curr_user.name,
                surname: curr_user.surname
            },
            body: req.body.body,
            date: new Date()
        })

        post.save()
        res.send(post)
    }catch (e) {
        res.status(500).send({message: e.message})
    }
})

router.post('/', async (req, res) => {
    try{
        const decoded = verify(req.headers.authorization)
        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            author: decoded//.id
        })
        await post.save();
        res.send(post)
    } catch (e){
        res.status(500).send({message: e.message});
    }
})

router.delete('/:id', async (req, res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.send({message: "post deleted"})
    } catch (e){
        res.status(500).send({message: e.message})
    }
})

module.exports = router

