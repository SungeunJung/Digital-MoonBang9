const { User } = require("../models/User");

//인증처리 하는 곳
let auth = (req, res, next) => {
   
    //client 쿠키에서 token을 가져옴
    let token = req.cookies.x_auth;

    //token을 복호화한 후 user를 찾음
    User.findByToken(token, (err, user) => {

        //user가 없으면 인증 실패
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        //user가 있으면 인증 완료
        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };