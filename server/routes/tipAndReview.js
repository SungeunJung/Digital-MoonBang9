const express = require('express');
const router = express.Router();
const { Tip } = require("../models/Tip");
const { Review } = require("../models/Review");

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
    let type = req.query.Type
    
    if(type === 0) {
        let tip = new Tip({ title: req.body.title, content: req.body.content, writer: req.body.writer });
        
        tip.save((err, postInfo) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({ success: true, postInfo })
        })
    }
    else {
        let review = new Review({ title: req.body.title, content: req.body.content, writer: req.body.writer });

        review.save((err, postInfo) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({ success: true, postInfo })
        })
    }
});


router.get("/getTipOrReview", (req, res) => {
    let type = req.query.Type

    if(type === 0) {
        return 0
        /*Tip.find()
        .populate("writer")
        .exec((err, tipOrReviews) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, tipOrReviews });
        });*/
    }
    else {
        Review.find()
        .populate("writer")
        .exec((err, tipOrReviews) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, tipOrReviews });
        });
    }
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

module.exports = router;