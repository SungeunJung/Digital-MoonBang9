const express = require('express');
const router = express.Router();
const { Notice } = require("../models/Notice");
const { auth } = require("../middleware/auth");

//=================================
//             Notice
//=================================

router.post("/createPost", auth, (req, res) => {
    let notice = new Notice({ 
        title: req.body.title, summary: req.body.summary, 
        description: req.body.description, writer: req.body.writer });

    notice.save((err, postInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, postInfo })
    })
});

router.post("/getNotices", (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);

    Notice.find()
        .populate("writer")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .exec((err, notices) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, notices });
        });
});

router.get("/getNoticesCount", (req, res) => {
    Notice.count({}, function(err, count){
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, count });
    })
});

router.post("/getPost", (req, res) => {
    console.log(req.body)
    Notice.findOne({ "_id": req.body.postId })
        .populate('writer')
        .exec((err, post) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, post })
        })
});

router.post("/deleteNotice", (req, res) => {
    Notice.deleteOne({ "_id": req.body.noticeID })
        .then(function(){
            return res.status(200).json({ success: true }) 
            })
        .catch(function(err){
            return res.json({ success: false, err }); 
        })
})

module.exports = router;