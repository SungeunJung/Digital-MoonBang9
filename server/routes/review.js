const express = require('express');
const router = express.Router();
const { Review } = require("../models/Review");
const { auth } = require("../middleware/auth");

//=================================
//             Review
//=================================

router.post("/createPost", (req, res) => {
    let review = new Review({ 
        title: req.body.title, template: req.body.template, rate: req.body.rate,
        description: req.body.description, writer: req.body.writer });

    review.save((err, postInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, postInfo })
    })
});

router.post("/getReviews", (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);

    Review.find()
        .populate("writer")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, reviews });
        });
});

router.get("/getReviewsCount", (req, res) => {
    Review.count({}, function(err, count){
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, count });
    })
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