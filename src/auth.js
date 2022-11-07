const mongoose = require("mongoose");

const User = mongoose.model('User');
const {verify, secretOrPrivateKey} = require('./token')

function fetchUserByToken(req) {
    return new Promise(async (resolve, reject) => {
        if(req.headers && req.headers.authorization){
            const authorization = req.headers.authorization;
            let decoded;

            try{
                decoded = verify(authorization, secretOrPrivateKey);
            }catch (e){
                reject(e.message);
            }

            let userId = decoded.id;
            try{
                let user = await User.findOne({id: userId, email: decoded.email})
                resolve(user);
            } catch (e){
                reject(e.message);
            }
        }else{
            reject('No token')
        }
    })
}

module.exports = {fetchUserByToken}