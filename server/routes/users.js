const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { sendEmail } = require('../mail');
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//인증코드 이메일로 보내기
router.post('/sendEmail', (req, res) => {
    //console.log(req.body)
    sendEmail(req.body.email, req.body.name, req.body.auth)
    return res.status(200).json({
      success: true
    })
  })

//여기까지 미들웨어(auth)를 통과했다는 얘기는 Authentication이 True 라는 의미
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id, //auth.js에서 user를 req.user에 넣어줘서 가능
        nickname: req.user.nickname,
        isAdmin: req.user.role === 0 ? false : true, //role 0이면 일반유저 0이 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
    });
});

//회원가입 라우트
router.post("/register", (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

//로그인 라우트
router.post("/login", (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

            //비밀번호까지 맞다면 토큰을 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //token을 저장. 어디에? 쿠키, 로컬스토리지 등 여기서는 쿠키로 저장
                res.cookie("x_authExp", user.tokenExp);
                res
                    .cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, 
        { token: "", tokenExp: "" }, 
        (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/modifyinfo", auth, (req, res) => {
    const user = new User(req.body);


    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
    
  });

module.exports = router;
