const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tipSchema = mongoose.Schema({
    title: {
        type:String,
    },
    content: {
        type:String,
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const Tip = mongoose.model('Tip', tipSchema);

module.exports = { Tip }