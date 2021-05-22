const express = require('express');
const router = express.Router();
const { Tip } = require("../models/Tip");
const { uploadQuillEditor } = require("../S3upload");

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

router.post("/uploadfiles", auth, (req, res) => {    
    const upload_ = uploadQuillEditor.single("file");
    upload_(req, res, err => {
        console.log(req.file)
        if(err) return res.json({ success: false, err })        
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

router.post("/deleteTip", (req, res) => {
    Tip.deleteOne({ "_id": req.body.tipID })
        .then(function(){
            return res.status(200).json({ success: true }) 
            })
        .catch(function(err){
            return res.json({ success: false, err }); 
        })
})

module.exports = router;