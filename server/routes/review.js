const express = require('express');
const router = express.Router();
const { Review } = require("../models/Review");
const { auth } = require("../middleware/auth");

//=================================
//             Review
//=================================

router.post("/createPost", (req, res) => {
    let review = new Review({ 
        title: req.body.title, template: req.body.template, content: req.body.content, writer: req.body.writer });

    review.save((err, postInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, postInfo })
    })
});

router.get("/getReviews", (req, res) => {
    Review.find()
        .populate("writer")
        .exec((err, reviews) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, reviews });
        });
});

router.post("/getPost", (req, res) => {
    console.log(req.body)
    Review.findOne({ "_id": req.body.postId })
        .populate('writer')
        .exec((err, post) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, post })
        })
});

module.exports = router;