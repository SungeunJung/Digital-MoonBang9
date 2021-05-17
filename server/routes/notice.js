const express = require('express');
const router = express.Router();
const { Notice } = require("../models/Notice");
const { auth } = require("../middleware/auth");

//=================================
//             Notice
//=================================

router.post("/createPost", (req, res) => {
    let notice = new Notice({ 
        title: req.body.title, content: req.body.content, writer: req.body.writer });

    notice.save((err, postInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, postInfo })
    })
});

router.get("/getNotices", (req, res) => {
    Notice.find()
        .populate("writer")
        .exec((err, notices) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, notices });
        });
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

module.exports = router;