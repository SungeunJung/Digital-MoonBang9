const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeSchema = mongoose.Schema({
    title: {
        type: String, 
        maxlength: 50
    },
    description: {
        type: String,
    },
    content: {
        type:String,
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const Notice = mongoose.model('Notice', noticeSchema);

module.exports = { Notice }