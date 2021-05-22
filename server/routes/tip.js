const express = require('express');
const router = express.Router();
const { Tip } = require("../models/Tip");

const { auth } = require("../middleware/auth");
const multer = require("multer");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Tip
//=================================

// fieldname: 'file',
// originalname: 'React.png',
// encoding: '7bit',
// mimetype: 'image/png',
// destination: 'uploads/',
// filename: '1573656172282_React.png',
// path: 'uploads/1573656172282_React.png',
// size: 24031 

router.post("/uploadfiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.post("/createPost", (req, res) => {
    let tip = new Tip({ title: req.body.title, description: req.body.description, 
        writer: req.body.writer });

    tip.save((err, postInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, postInfo })
    })

    //생각 해보니  세이브 할떄 populate 할필요가 없다.   가져올떄 하면 되니깐...
    // tip.save((err, response) => {
    //     if (err) return res.json({ success: false, err });
    //     Tip.find({ _id: response._id })
    //         .populate('writer')
    //         .exec((err, result) => {
    //             let postInfo = result[0]
    //             if (err) return res.json({ success: false, err });
    //             return res.status(200).json({ success: true,  postInfo });
    //         })
    // });
});


router.post("/getTips", (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);

    Tip.find()
        .populate("writer")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .exec((err, tips) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, tips });
        });
});

router.get("/getTipsCount", (req, res) => {
    Tip.count({}, function(err, count){
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, count });
    })
});


router.post("/getPost", (req, res) => {
    console.log(req.body)
    Tip.findOne({ "_id": req.body.postId })
        .populate('writer')
        .exec((err, post) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, post })
        })
});

router.post("/getMyPost", (req, res) => {
    Tip.find({ 'writer' : { $in : req.body.id} })
        .sort({ "createdAt" : -1 })
        .exec((err, tips) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, tips})
        })
    
});

module.exports = router;