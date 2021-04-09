const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User' //User model에서 가져옴
    },
    nickname: {
        type: String, 
    },
    title: {
        type: String, 
        maxlength: 50
    },
    description: {
        type: String,
    },
    category: {
        type: Number,
        default: 1
    },
    detail: {
        type: Number,
        default: 1
    },
    images: {
        type: Array,
        default: []
    },
    downloads: {
        type: Number,
        maxlength: 1000,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {timestamps: true}) //timestamps를 통해서 생성 및 갱신 시간을 알 수 있음

const Template = mongoose.model('Template', templateSchema)

module.exports = { Template }