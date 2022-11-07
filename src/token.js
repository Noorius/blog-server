const JsonWebToken = require("jsonwebtoken");

function sign(data){
    return JsonWebToken.sign(data, process.env.SECRET_KEY);
}

function verify(token){
    return JsonWebToken.verify(token, process.env.SECRET_KEY);
}

module.exports = { sign, verify };