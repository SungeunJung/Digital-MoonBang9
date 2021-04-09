const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String, 
        trim: true, 
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    nickname: {
        type: String,
        maxlength: 50
    },
    role: { //관리자 or 일반 유저
        type: Number,
        default: 0
    },
    image: String, 
    token: {
        type: String
    },
    tokenExp: { //토큰 유효기간
        type: Number
    }
})

userSchema.pre('save', function( next ){ //user 정보를 저장하기 전에 실행
    var user = this; //== userSchema

    if(user.isModified('password')){ //password 변경시에만
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
}) 


userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567와 암호화된 비밀번호가 같은지 확인. plainPassword를 암호화하여 확인.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch)
    }) 
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebToken을 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    var oneHour = moment().add(1, 'hour').valueOf();
    //user._id + 'secretToken' = token
    //'secretToken' -> user._id
    user.token = token
    user.tokenExp = oneHour
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //token을 decode함
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //user id를 이용해서 user를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }