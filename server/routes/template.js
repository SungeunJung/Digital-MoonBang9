const express = require('express');
const router = express.Router();
const { Template } = require("../models/Template");
const { auth } = require("../middleware/auth");
const { response } = require('express');
const { uploadTemplateImage, uploadTemplateFile } = require("../S3upload");

//=================================
//             Template
//=================================

//여기까지 미들웨어(auth)를 통과했다는 얘기는 Authentication이 True 라는 의미
router.post("/uploadImage", auth, (req, res) => {
    var image_upload = uploadTemplateImage.single("file");
    image_upload(req, res, err => {
        //console.log(req.file)
        if(err) return res.json({ success: false, err })
        return res.json({ success: true, image: res.req.file.key})
    })
});

router.post("/uploadFile", auth, (req, res) => {
    var file_upload = uploadTemplateFile.single("file")
    file_upload(req, res, err => {
        //console.log(req.file)
        if(err) return res.json({ success: false, err })
        return res.json({ success: true, fileName: res.req.file.key })
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
    //let sortBy = req.body.sortBy ? req.body.sortBy : 1;
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);
    let term = req.body.searchTerm;
    let field = {}, sortBy={}, findArgs={};
    if(req.body.searchField!="total") {
        field[req.body.searchField] = {'$regex':term};
    }
    if(req.body.sortBy=="title" || req.body.sortBy=="nickname") {
        sortBy[req.body.sortBy] = 1
    } else {
        sortBy[req.body.sortBy] = -1
    }
    let category = req.body.category ? req.body.category.split("")[1] : null;
    let detail = req.body.category ? req.body.category.split("")[2]? req.body.category.split("")[2]:null : null;

    if(category != null) {
        findArgs['category'] = category;
    }
    if(detail != null) {
        findArgs['detail'] = detail;
    }

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

    if(term) {
        if(req.body.searchField!="total") {
            Template.find(findArgs)
            .find(field) //몽고디비 메소드 
            .populate("writer")
            .sort(sortBy) 
            .skip(skip)
            .limit(limit)
            .exec((err, templates) => {
                if(err) {return res.status(400).json({ success: false, err })}
                res.status(200).json({ success: true, templates, postSize: templates.length })
            })
        }
        else {
            Template.find(findArgs)
            .find({ $text: { $search: term } }) //몽고디비 메소드 
            .populate("writer")
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .exec((err, templates) => {
                if(err) {return res.status(400).json({ success: false, err })}
                res.status(200).json({ success: true, templates, postSize: templates.length })
            })
        }
        
    } else {
        Template.find(findArgs)
            .populate("writer")
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .exec((err, templates) => {
                if(err) {return res.status(400).json({ success: false, err })}
                res.status(200).json({ success: true, templates, postSize: templates.length })
            })
    }
    
});

//?id=${templateId}&type=single
//여러개 가져올 때는 type=array
router.get("/templates_by_id", (req, res) => {//
    let type = req.query.type
    let templateIds = req.query.id

    if(type === "array") {
        let ids = req.query.id.split(',');
        templateIds = [];
        templateIds = ids.map(item => {
            return item
        })
    }
    //we need to find the template information that belongs to template id
    Template.find({ '_id':{ $in: templateIds } })
        .populate('writer')
        .exec((err, template) => {
            if(err) return req.status(400).send(err)
            return res.status(200).send(template)
        })
});

router.post("/getLikeTemplates", (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : -1;
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);
    let recommend = req.body.recommend ? req.body.recommend : false;

    if(recommend) {
        Template.find({ '_id' : { $in : req.body.likes} })
        .populate("writer")
        .exec((err, templates) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, templates})
        })
    }
    else {
        Template.find({ '_id' : { $in : req.body.likes} })
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, templates) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, templates, postSize: templates.length})
        })
    }
    
    
});

router.post("/getBestTemplates", (req, res) => {
    Template.find()
        .populate("writer")
        .sort({ "downloads" : -1 })
        .limit(5)
        .exec((err, templates) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, templates})
        })
    
});

router.post("/getRecommendTemplates", auth, (req, res) => {
    let category = {}, style={}, find = {}
    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "category") {
                category[key] = req.body.filters[key];
            }
            else {
                style[key] = req.body.filters[key];
            }
        }
    }
    find['$or'] = [category,style] //나중에 or->and로 변경

    Template.find(find)
        .find({ writer: {$ne: req.user._id} })
        //.find({ _id : { $ne : req.body.like} })
        .populate("writer")
        .limit(12)
        .exec((err, templates) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, templates })
        })
});

router.post("/getMyPost", auth, (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = parseInt(req.body.skip);

    Template.find({ 'writer' : { $in : req.body.id} })
        .sort({ "createdAt" : -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, templates) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, templates})
        })
});

router.post("/getMyPostCount", auth, (req, res) => {
    Template.find({ 'writer' : { $in : req.body.id} })
    .exec((err, templates) => {
        if(err) {return res.status(400).json({ success: false, err })}
        res.status(200).json({ success: true, count:templates.length })
    })
});

router.post("/getMyPageTemplates", auth, (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 20; 
    let skip = parseInt(req.body.skip);

    Template.find({ '_id' : { $in : req.body.template} })
        .populate("writer")
        .sort({ "date" : -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, templates) => {
            if(err) {return res.status(400).json({ success: false, err })}
            res.status(200).json({ success: true, templates, postSize: templates.length})
        })
    
});

router.post("/increaseDownload", auth, (req, res) => {
    Template.findOneAndUpdate({ _id: req.body.templateId }, 
        { downloads:(req.body.download+1)}, 
        (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });    
    }) .setOptions({ runValidators: true })
    .exec();   
});

router.post("/increaseView", auth, (req, res) => {
    Template.findOneAndUpdate({ _id: req.body.templateId }, 
        { views:(req.body.view+1)}, 
        (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });    
    }) .setOptions({ runValidators: true })
    .exec();   
});

router.post("/deleteTemplate", (req, res) => {
    Template.deleteOne({ "_id": req.body.templateID })
        .then(function(){
            return res.status(200).json({ success: true }) 
            })
        .catch(function(err){
            return res.json({ success: false, err }); 
        })   
})

router.post("/modifyLikes", auth, (req, res) => {
    Template.findOneAndUpdate({ _id: req.body.templateId }, 
        { likes:req.body.like }, 
        (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });    
    })
    .exec();   
});

router.post("/editTemplate", auth, (req, res) => {
    Template.findOneAndUpdate({ _id: req.body.templateId }, 
        {
            title:req.body.title,
            designer:req.body.designer,
            description:req.body.description,
            images:req.body.images,
            uploadedFile:req.body.uploadedFile,
            uploadedUrl:req.body.uploadedUrl,
            category:req.body.category,
            detail:req.body.detail,
            styles:req.body.styles
        }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });    
    })
    .exec();   
});

module.exports = router;
