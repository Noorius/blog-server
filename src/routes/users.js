const express = require('express')
const mongoose = require('mongoose')
const Bcrypt = require('bcryptjs')
const { sign } = require('../token')

const router = express.Router();


// multer
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000000 },
});





const User = mongoose.model('User');

router.post('/signup', upload.single("avatar"), async (req, res) => {

    if(!req.body.email || !req.body.password){
        res.status(400).send({message: "No email or password"})
    }

    // console.log(req.body)
    // console.log(req.file)

    const new_user = new User({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: Bcrypt.hashSync(req.body.password, 10),
        avatar: req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename
    })

    try {
        const user = await new_user.save();
        const token = sign({id: user._id, email: user.email, name: user.name, surname: user.surname})
        res.send({token: token});
    } catch (err) {
        if(err.message.startsWith('E11000')) res.status(500).send({message: 'User already exists'})
        else res.status(500).send({message: err.message})
    }
})

router.post('/signin', async (req, res) => {
    if(!req.body.email || !req.body.password){
        res.status(400).send({message: "No email or password"})
    }

    try{
        const user = await User.findOne({email: req.body.email});

        if(!user){
            res.status(404).send({message: "User does not exist"})
        }else if(!Bcrypt.compareSync(req.body.password, user.password)){
            res.status(400).send({message: "Incorrect password"})
        }else{
            const token = sign({id: user._id, email: user.email, name: user.name, surname: user.surname});
            res.send({token: token});
        }
    } catch (e){
        res.send({message: e.message});
    }


})



module.exports = router;
