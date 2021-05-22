const express = require('express');
const router = express.Router();
const { Tip } = require("../models/Tip");
const { uploadTipImage } = require("../S3upload");

const { auth } = require("../middleware/auth");
const multer = require("multer");


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
    console.log(req.file)
    const uploadImage = uploadTipImage.single("file");
    uploadImage(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.location, fileNmae: res.req.file.key });
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


router.get("/getTips", (req, res) => {
    Tip.find()
        .populate("writer")
        .exec((err, tips) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, tips });
        });
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