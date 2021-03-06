const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { sendEmail } = require('../mail');
const { auth } = require("../middleware/auth");
const { uploadUserProfile } = require("../S3upload");

//=================================
//             User
//=================================

//인증코드 이메일로 보내기
router.post('/sendEmail', (req, res) => {
    sendEmail(req.body.email, req.body.name, req.body.auth)
    return res.status(200).json({
      success: true
    })
  })

router.get('/getAdmin', auth, (req, res) => {
    return res.status(200).json({
        success: true,
        isAdmin: req.user.role === 0 ? false : true
      })
})

//여기까지 미들웨어(auth)를 통과했다는 얘기는 Authentication이 True 라는 의미
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id, //auth.js에서 user를 req.user에 넣어줘서 가능
        nickname: req.user.nickname,
        isAdmin: req.user.role === 0 ? false : true, //role 0이면 일반유저 0이 아니면 관리자!
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        like: req.user.like,
        download: req.user.download,
        history: req.user.history,
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
    User.findOneAndUpdate({ _id: req.user._id }, 
        { nickname:req.body.nickname, password:req.body.password, image:req.body.image }, 
        (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });    
    }) .setOptions({ runValidators: true })
    .exec();   
});

router.post("/addToLike", auth, (req, res) => {
    //먼저  User Collection에 해당 유저의 정보를 가져오기 
    User.findOne({ _id: req.user._id },
         (err, userInfo) => {
             // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
             let duplicate = false;
             userInfo.like.forEach((item) => {
                 if (item.id === req.body.templateId) {
                     duplicate = true;
                 }
             })
             //상품이 이미 있을때
             if (duplicate) {
                 User.findOneAndUpdate(
                     { _id: req.user._id, "like.id": req.body.templateId },
                     {
                        $pull: {
                            like: {
                               id: req.body.templateId,
                               quantity: 1
                            }
                        }
                    },
                     { new: true },
                     (err, userInfo) => {
                         if (err) return res.status(200).json({ success: false, err })
                         res.status(200).send(userInfo.like)
                     }
                 )
             }
             //상품이 이미 있지 않을때 
             else {
                 User.findOneAndUpdate(
                     { _id: req.user._id },
                     {
                         $push: {
                             like: {
                                id: req.body.templateId,
                                quantity: 1,
                                date: Date.now()
                             }
                         }
                     },
                     { new: true },
                     (err, userInfo) => {
                         if (err) return res.status(400).json({ success: false, err })
                         res.status(200).send(userInfo.like)
                     }
                 )
             }
         })
 });

router.get("/getLikes", auth, (req, res) => {
    res.status(200).json({
        success: true, 
        likes:req.user.like
    });
});

router.post("/uploadUserProfile", auth,  (req,res) => {  
    var uploadImage = uploadUserProfile.single("file");
    uploadImage(req, res, err => {
        if(err) return res.json({ success: false, err })
        return res.json({ success: true, image: res.req.file.key })   
    }) 
})

router.post("/duplicateCheck", auth, (req, res) => {
    User.findOne({ nickname : req.body.nickname }, (err, user) => {
        if (!user)
            return res.json({success:true})
            else res.json ({success:false})
        }
    )
});

router.post("/addDownload", auth, (req, res) => {
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {
            let duplicate = false;
            userInfo.download.forEach((item) => {
                if (item.id === req.body.templateId) {
                    duplicate = true;
                }
            })
            if (duplicate) {
                
            }
            else {
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            download: {
                               id: req.body.templateId,
                               date: Date.now()
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(400).json({ success: false, err })
                        res.status(200).send(userInfo.like)
                    }
                )
            }
        })
});

router.post("/addHistory", auth, (req, res) => {
    User.findOne({ _id: req.user._id },
         (err, userInfo) => {
             let duplicate = false;
             userInfo.history.forEach((item) => {
                 if (item.id === req.body.templateId) {
                     duplicate = true;
                 }
             })
             if (duplicate) {
                 
             }
             else {
                 User.findOneAndUpdate(
                     { _id: req.user._id },
                     {
                         $push: {
                             history: {
                                id: req.body.templateId,
                                date: Date.now(),
                             }
                         }
                     },
                     { new: true },
                     (err, userInfo) => {
                         if (err) return res.status(400).json({ success: false, err })
                         res.status(200).send({ success: true, count:userInfo.history.length })
                     }
                 )
             }
         })
 });

 router.post("/deleteHistory", auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $pop: {
                history:-1,
            }
        },
        (err, userInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send({ success: true, count:userInfo.history.length })
        }
    )    
 });

 

module.exports = router;
