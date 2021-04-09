const express = require('express');
const router = express.Router();
const { Template } = require("../models/Template");
const multer = require('multer');
const { auth } = require("../middleware/auth");


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false)
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

//=================================
//             Template
//=================================



//여기까지 미들웨어(auth)를 통과했다는 얘기는 Authentication이 True 라는 의미
router.post("/uploadImage", auth, (req, res) => {
    //after getting that image from client
    //we need to save it inside Node Server

    upload(req, res, err => {
        if(err) return res.json({ success: false, err })
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })
});

router.post("/uploadTemplate", auth, (req, res) => {
    //save all the data we got from the client into the DB
    const template = new Template(req.body)
    template.save((err) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
});

router.post("/getTemplates", (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : -1;
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);

    let findArgs = {};

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "detail") {

            } else {
                findArgs[key] = req.body.filters[key];
                //findArgs['categories'] = [1,3,4]
                //key가 카테고리나 세부 카테고리, req.body.filters[key]가 선택한 index값
            }
        }
    }

    Template.find(findArgs)
    .populate("writer")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, templates) => {
        if(err) {console.log('err');return res.status(400).json({ success: false, err })}
        console.log('here')
        console.log(templates)
        res.status(200).json({ success: true, templates, postSize: templates.length })
    })
});


module.exports = router;
